import "dotenv/config";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
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

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

async function main() {
  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.$executeRaw`DELETE FROM "Opportunity"`;
  await prisma.$executeRaw`DELETE FROM "Publication"`;
  await prisma.$executeRaw`DELETE FROM "ProfessorResearchArea"`;
  await prisma.$executeRaw`DELETE FROM "Professor"`;
  await prisma.$executeRaw`DELETE FROM "ResearchArea"`;
  await prisma.$executeRaw`DELETE FROM "Department"`;
  await prisma.$executeRaw`DELETE FROM "Institute"`;

  // Reset sequences
  await prisma.$executeRaw`ALTER SEQUENCE "Institute_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Department_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Professor_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "ResearchArea_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Publication_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Opportunity_id_seq" RESTART WITH 1`;

  // Read Excel
  const workbook = XLSX.readFile("data/faculty_data.xlsx");
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  console.log(`Processing ${rows.length} rows...`);

  // Phase 1: Collect unique values
  const instituteMap = new Map<string, number>();
  const departmentMap = new Map<string, { id: number; instituteKey: string }>();
  const professorRows: { name: string; email: string | null; deptKey: string }[] = [];
  const researchAreaSet = new Set<string>();
  const profAreaLinks: { profIdx: number; areaName: string }[] = [];

  for (const row of rows as any[]) {
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
  console.log(`Professors: ${professorRows.length}`);
  console.log(`Unique research areas: ${researchAreaSet.size}`);

  // Phase 2: Bulk insert Institutes
  console.log("Inserting institutes...");
  const instEntries = Array.from(instituteMap.entries());
  for (let i = 0; i < instEntries.length; i += 50) {
    const batch = instEntries.slice(i, i + 50);
    const values = batch.map(([name]) => `('${name.replace(/'/g, "''")}', '${name.replace(/'/g, "''")}', NOW(), NOW())`).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "Institute" ("name", "shortName", "createdAt", "updatedAt") VALUES ${values}`);
  }

  // Phase 3: Bulk insert Departments
  console.log("Inserting departments...");
  const deptEntries = Array.from(departmentMap.entries());
  for (let i = 0; i < deptEntries.length; i += 50) {
    const batch = deptEntries.slice(i, i + 50);
    const values = batch.map(([key, { id, instituteKey }]) => {
      const name = key.split("::")[0].replace(/'/g, "''");
      const instId = instituteMap.get(instituteKey);
      return `(${id}, '${name}', ${instId}, NOW(), NOW())`;
    }).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "Department" ("id", "name", "instituteId", "createdAt", "updatedAt") VALUES ${values}`);
  }

  // Phase 4: Bulk insert Professors
  console.log("Inserting professors...");
  for (let i = 0; i < professorRows.length; i += 50) {
    const batch = professorRows.slice(i, i + 50);
    const values = batch.map(({ name, email, deptKey }, idx) => {
      const id = i + idx + 1;
      const deptId = departmentMap.get(deptKey)!.id;
      const e = email ? `'${email.replace(/'/g, "''")}'` : "NULL";
      return `(${id}, '${name.replace(/'/g, "''")}', ${e}, ${deptId}, NOW(), NOW())`;
    }).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "Professor" ("id", "name", "email", "departmentId", "createdAt", "updatedAt") VALUES ${values}`);
  }

  // Phase 5: Bulk insert Research Areas
  console.log("Inserting research areas...");
  const areaArr = Array.from(researchAreaSet);
  const areaIdMap = new Map<string, number>();
  for (let i = 0; i < areaArr.length; i += 50) {
    const batch = areaArr.slice(i, i + 50);
    const values = batch.map((name, idx) => {
      const id = i + idx + 1;
      areaIdMap.set(name, id);
      return `(${id}, '${name.replace(/'/g, "''")}', NOW())`;
    }).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "ResearchArea" ("id", "name", "createdAt") VALUES ${values}`);
  }
  // Make sure all areas have IDs
  areaArr.forEach((name, idx) => {
    if (!areaIdMap.has(name)) areaIdMap.set(name, idx + 1);
  });

  // Phase 6: Bulk insert ProfessorResearchArea links
  console.log("Inserting professor-research area links...");
  for (let i = 0; i < profAreaLinks.length; i += 100) {
    const batch = profAreaLinks.slice(i, i + 100);
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

  // Phase 7: Generate Publications
  console.log("Generating publications...");
  const pubBatch: string[] = [];
  let pubId = 1;
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
      const t = title.replace(/'/g, "''");
      const v = venue.replace(/'/g, "''");
      pubBatch.push(`(${pubId++}, '${t}', ${year}, '${v}', ${citations}, ${profId}, NOW())`);
    }
  }
  for (let i = 0; i < pubBatch.length; i += 500) {
    const batch = pubBatch.slice(i, i + 500).join(",");
    await prisma.$executeRawUnsafe(`INSERT INTO "Publication" ("id", "title", "year", "journal", "citationCount", "professorId", "createdAt") VALUES ${batch}`);
  }
  console.log(`Generated ${pubBatch.length} publications`);

  // Phase 8: Generate Opportunities
  console.log("Generating opportunities...");
  const oppBatch: string[] = [];
  let oppId = 1;
  for (let profId = 1; profId <= professorRows.length; profId++) {
    const seed = hashString(`opp-${profId}`);
    const numOpps = seed % 3;
    for (let i = 0; i < numOpps; i++) {
      const tmpl = OPP_TEMPLATES[(seed + i) % OPP_TEMPLATES.length];
      const dl = new Date();
      dl.setDate(dl.getDate() + 30 + (seed % 180));
      const dlStr = dl.toISOString().split("T")[0];
      const t = tmpl.title.replace(/'/g, "''");
      const d = tmpl.description.replace(/'/g, "''");
      const ty = tmpl.type.replace(/'/g, "''");
      oppBatch.push(`(${oppId++}, '${t}', '${ty}', '${d}', '${dlStr}', true, ${profId}, NOW())`);
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
