require("dotenv/config");
const XLSX = require("xlsx");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const VENUES = [
  "NeurIPS", "CVPR", "Nature Communications", "IEEE Transactions on Robotics",
  "ACM CCS", "Physical Review Letters", "Cell Reports", "ICRA",
  "Journal of Climate", "Advanced Materials", "ICML", "AAAI",
  "IEEE Trans. PAMI", "Science Robotics", "Nature Machine Intelligence",
  "ACM Computing Surveys", "IEEE JSAC", "JMLR",
];

const OPP_TEMPLATES = [
  { type: "PhD Position", title: "Doctoral Researcher", description: "Full-time PhD position with institute fellowship, focused on open problems in the lab's core research direction." },
  { type: "RA Position", title: "Research Assistant", description: "Funded RA position for graduates to support ongoing sponsored projects, with potential pathway into the PhD programme." },
  { type: "Internship", title: "Summer Research Internship", description: "8-10 week hands-on research internship for undergraduates, culminating in a co-authored technical report." },
  { type: "Project", title: "B.Tech Project Collaboration", description: "Semester-long project slot for final-year undergraduates to contribute to an active sponsored research project." },
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function esc(s) {
  return String(s).replace(/'/g, "''");
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.$executeRawUnsafe('DELETE FROM "Opportunity"');
  await prisma.$executeRawUnsafe('DELETE FROM "Publication"');
  await prisma.$executeRawUnsafe('DELETE FROM "ProfessorResearchArea"');
  await prisma.$executeRawUnsafe('DELETE FROM "Professor"');
  await prisma.$executeRawUnsafe('DELETE FROM "ResearchArea"');
  await prisma.$executeRawUnsafe('DELETE FROM "Department"');
  await prisma.$executeRawUnsafe('DELETE FROM "Institute"');

  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Institute_id_seq" RESTART WITH 1');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Department_id_seq" RESTART WITH 1');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Professor_id_seq" RESTART WITH 1');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "ResearchArea_id_seq" RESTART WITH 1');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Publication_id_seq" RESTART WITH 1');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Opportunity_id_seq" RESTART WITH 1');

  const workbook = XLSX.readFile("data/faculty_data.xlsx");
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  console.log(`Processing ${rows.length} raw rows...`);

  const instituteMap = new Map();
  const departmentMap = new Map();
  const professorSeen = new Set();
  const professorRows = [];
  const researchAreaSet = new Set();
  const profAreaLinks = [];

  for (const row of rows) {
    const instName = String(row["Institute"] || "").trim();
    const deptName = String(row["Department"] || "").trim();
    const profName = String(row["Faculty Name"] || "").trim();
    const email = String(row["Email"] || "").trim() || null;
    const areas = String(row["Research Areas"] || "").trim();

    if (!instName || !deptName || !profName) continue;

    if (!instituteMap.has(instName)) {
      instituteMap.set(instName, instituteMap.size + 1);
    }

    const deptKey = `${deptName}::${instName}`;
    if (!departmentMap.has(deptKey)) {
      departmentMap.set(deptKey, { id: departmentMap.size + 1, instituteKey: instName });
    }

    const profKey = `${profName}::${deptKey}`;
    if (professorSeen.has(profKey)) continue;
    professorSeen.add(profKey);

    const profIdx = professorRows.length;
    professorRows.push({ name: profName, email, deptKey });

    const areaNames = areas.split(",").map(a => a.trim()).filter(Boolean);
    for (const areaName of areaNames) {
      researchAreaSet.add(areaName);
      profAreaLinks.push({ profIdx, areaName });
    }
  }

  console.log(`Unique institutes: ${instituteMap.size}`);
  console.log(`Unique departments: ${departmentMap.size}`);
  console.log(`Unique professors: ${professorRows.length}`);
  console.log(`Unique research areas: ${researchAreaSet.size}`);

  console.log("Inserting institutes...");
  const instEntries = Array.from(instituteMap.entries());
  for (let i = 0; i < instEntries.length; i += 50) {
    const batch = instEntries.slice(i, i + 50);
    const values = batch.map(([name]) => `('${esc(name)}', '${esc(name)}', NOW(), NOW())`).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "Institute" ("name", "shortName", "createdAt", "updatedAt") VALUES ${values}`);
  }

  console.log("Inserting departments...");
  const deptEntries = Array.from(departmentMap.entries());
  for (let i = 0; i < deptEntries.length; i += 50) {
    const batch = deptEntries.slice(i, i + 50);
    const values = batch.map(([key, { id, instituteKey }]) => {
      const name = key.split("::")[0];
      const instId = instituteMap.get(instituteKey);
      return `(${id}, '${esc(name)}', ${instId}, NOW(), NOW())`;
    }).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "Department" ("id", "name", "instituteId", "createdAt", "updatedAt") VALUES ${values}`);
  }

  console.log("Inserting professors...");
  for (let i = 0; i < professorRows.length; i += 50) {
    const batch = professorRows.slice(i, i + 50);
    const values = batch.map(({ name, email, deptKey }, idx) => {
      const id = i + idx + 1;
      const deptId = departmentMap.get(deptKey).id;
      const e = email ? `'${esc(email)}'` : "NULL";
      return `(${id}, '${esc(name)}', ${e}, ${deptId}, NOW(), NOW())`;
    }).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "Professor" ("id", "name", "email", "departmentId", "createdAt", "updatedAt") VALUES ${values}`);
  }

  console.log("Inserting research areas...");
  const areaArr = Array.from(researchAreaSet);
  const areaIdMap = new Map();
  for (let i = 0; i < areaArr.length; i += 50) {
    const batch = areaArr.slice(i, i + 50);
    const values = batch.map((name, idx) => {
      const id = i + idx + 1;
      areaIdMap.set(name, id);
      return `(${id}, '${esc(name)}', NOW())`;
    }).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "ResearchArea" ("id", "name", "createdAt") VALUES ${values}`);
  }

  console.log("Inserting professor-research area links...");
  for (let i = 0; i < profAreaLinks.length; i += 200) {
    const batch = profAreaLinks.slice(i, i + 200);
    const values = batch.map(({ profIdx, areaName }) => {
      const profId = profIdx + 1;
      const areaId = areaIdMap.get(areaName);
      if (!areaId) return null;
      return `(${profId}, ${areaId})`;
    }).filter(Boolean).join(",");
    if (values) {
      await prisma.$executeRawUnsafe(`INSERT INTO "ProfessorResearchArea" ("professorId", "researchAreaId") VALUES ${values} ON CONFLICT DO NOTHING`);
    }
  }

  console.log("Generating publications...");
  let pubId = 1;
  const pubBatch = [];
  for (let profId = 1; profId <= professorRows.length; profId++) {
    const seed = hashString(`pub-${profId}`);
    const numPubs = 2 + (seed % 8);
    for (let i = 0; i < numPubs; i++) {
      const year = 2018 + ((seed + i) % 7);
      const venue = VENUES[(seed + i) % VENUES.length];
      const citations = (hashString(`cite-${profId}-${i}`) % 200) + 1;
      const adj = ["Novel", "Efficient", "Scalable", "Robust", "Adaptive"];
      const topics = ["Deep Learning", "Machine Learning", "Neural Networks", "Optimization", "Data Analysis"];
      const preps = ["Applied to", "for", "in", "Approach to", "Framework for"];
      const domains = ["Image Processing", "Natural Language", "Computer Vision", "Speech Recognition", "Pattern Recognition"];
      const title = `${adj[(seed+i)%adj.length]} ${topics[(seed+i)%topics.length]} ${preps[(seed+i*2)%preps.length]} ${domains[(seed+i*4)%domains.length]}`;
      pubBatch.push(`(${pubId++}, '${esc(title)}', ${year}, '${esc(venue)}', ${citations}, ${profId}, NOW())`);
    }
  }
  for (let i = 0; i < pubBatch.length; i += 500) {
    const batch = pubBatch.slice(i, i + 500).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "Publication" ("id", "title", "year", "journal", "citationCount", "professorId", "createdAt") VALUES ${batch}`);
  }
  console.log(`Generated ${pubBatch.length} publications`);

  console.log("Generating opportunities...");
  let oppId = 1;
  const oppBatch = [];
  for (let profId = 1; profId <= professorRows.length; profId++) {
    const seed = hashString(`opp-${profId}`);
    const numOpps = seed % 3;
    for (let i = 0; i < numOpps; i++) {
      const tmpl = OPP_TEMPLATES[(seed + i) % OPP_TEMPLATES.length];
      const dl = new Date();
      dl.setDate(dl.getDate() + 30 + (seed % 180));
      const dlStr = dl.toISOString().split("T")[0];
      oppBatch.push(`(${oppId++}, '${esc(tmpl.title)}', '${esc(tmpl.type)}', '${esc(tmpl.description)}', '${dlStr}', true, ${profId}, NOW())`);
    }
  }
  for (let i = 0; i < oppBatch.length; i += 500) {
    const batch = oppBatch.slice(i, i + 500).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "Opportunity" ("id", "title", "type", "description", "deadline", "isActive", "professorId", "createdAt") VALUES ${batch}`);
  }
  console.log(`Generated ${oppBatch.length} opportunities`);

  console.log("\nImport completed successfully!");
}

main()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
