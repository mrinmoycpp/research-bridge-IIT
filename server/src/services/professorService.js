const prisma = require("../config/db");
const {
  slugify,
  professorSlug,
  hashString,
  inferPosition,
  inferAvailability,
  generateBio,
  getLocation,
  getIITMeta,
} = require("../utils/helpers");

async function getAllProfessors(filters = {}, sort = "relevance") {
  let conditions = [];
  let params = [];
  let paramIdx = 1;

  if (filters.iit) {
    conditions.push(` LOWER(i."shortName") = LOWER($${paramIdx}) OR LOWER(REPLACE(i."shortName",' ','-')) = LOWER($${paramIdx}) `);
    params.push(filters.iit.replace(/-/g, " "));
    paramIdx++;
  }

  if (filters.department) {
    conditions.push(` LOWER(d.name) LIKE LOWER($${paramIdx}) `);
    params.push(`%${filters.department}%`);
    paramIdx++;
  }

  if (filters.query) {
    conditions.push(`(
      LOWER(p.name) LIKE LOWER($${paramIdx})
      OR LOWER(d.name) LIKE LOWER($${paramIdx})
      OR LOWER(i."shortName") LIKE LOWER($${paramIdx})
      OR LOWER(i.name) LIKE LOWER($${paramIdx})
      OR LOWER(p.bio) LIKE LOWER($${paramIdx})
      OR EXISTS (SELECT 1 FROM "ProfessorResearchArea" pra2 JOIN "ResearchArea" ra2 ON ra2.id = pra2."researchAreaId" WHERE pra2."professorId" = p.id AND LOWER(ra2.name) LIKE LOWER($${paramIdx}))
    )`);
    params.push(`%${filters.query}%`);
    paramIdx++;
  }

  if (filters.researchArea) {
    const areaName = filters.researchArea.replace(/-/g, " ");
    conditions.push(` EXISTS (SELECT 1 FROM "ProfessorResearchArea" pra3 JOIN "ResearchArea" ra3 ON ra3.id = pra3."researchAreaId" WHERE pra3."professorId" = p.id AND LOWER(ra3.name) = LOWER($${paramIdx})) `);
    params.push(areaName);
    paramIdx++;
  }

  if (filters.position) {
    conditions.push(` LOWER(p.designation) LIKE LOWER($${paramIdx}) `);
    params.push(`%${filters.position}%`);
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  let orderClause = "";
  switch (sort) {
    case "citations": orderClause = `ORDER BY "pubCount" DESC`; break;
    case "publications": orderClause = `ORDER BY "pubCount" DESC`; break;
    case "name-asc": orderClause = `ORDER BY p.name ASC`; break;
    case "recent": orderClause = `ORDER BY p.id DESC`; break;
    default: orderClause = `ORDER BY p.name ASC`; break;
  }

  const rows = await prisma.$queryRawUnsafe(`
    SELECT p.id, p.name, p.designation, p.bio, p.email, p."profileUrl",
      d.name as "deptName",
      i."shortName" as "instShort", i.name as "instName",
      (SELECT COUNT(*)::int FROM "Publication" pub WHERE pub."professorId" = p.id) as "pubCount",
      (SELECT COUNT(*)::int FROM "Opportunity" o WHERE o."professorId" = p.id) as "oppCount",
      ARRAY(SELECT ra.name FROM "ResearchArea" ra JOIN "ProfessorResearchArea" pra ON pra."researchAreaId" = ra.id WHERE pra."professorId" = p.id) as "areas"
    FROM "Professor" p
    JOIN "Department" d ON p."departmentId" = d.id
    JOIN "Institute" i ON d."instituteId" = i.id
    ${whereClause}
    ${orderClause}
    LIMIT 500
  `, ...params);

  let results = rows.map((r) => transformProfessorLite(r));

  if (filters.location) {
    results = results.filter((p) =>
      p.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.availability) {
    results = results.filter((p) => p.availability === filters.availability);
  }

  return results;
}

async function getProfessorBySlug(slug) {
  const idRows = await prisma.$queryRaw`
    SELECT p.id, p.name as "profName", d.name as "deptName"
    FROM "Professor" p
    JOIN "Department" d ON p."departmentId" = d.id
  `;

  const match = idRows.find((r) => professorSlug(r.profName, r.deptName) === slug);
  if (!match) return undefined;

  const [profRows, pubs, opps, areas] = await Promise.all([
    prisma.$queryRaw`
      SELECT p.id, p.name, p.designation, p.bio, p.email, p."profileUrl",
        d.name as "deptName",
        i."shortName" as "instShort", i.name as "instName"
      FROM "Professor" p
      JOIN "Department" d ON p."departmentId" = d.id
      JOIN "Institute" i ON d."instituteId" = i.id
      WHERE p.id = ${match.id}
    `,
    prisma.$queryRaw`
      SELECT title, journal, year, "citationCount", doi
      FROM "Publication"
      WHERE "professorId" = ${match.id}
    `,
    prisma.$queryRaw`
      SELECT title, type, deadline, description
      FROM "Opportunity"
      WHERE "professorId" = ${match.id}
    `,
    prisma.$queryRaw`
      SELECT ra.name
      FROM "ResearchArea" ra
      JOIN "ProfessorResearchArea" pra ON pra."researchAreaId" = ra.id
      WHERE pra."professorId" = ${match.id}
    `,
  ]);

  if (!profRows.length) return undefined;

  const r = profRows[0];

  return transformProfessorFull({
    id: r.id,
    name: r.name,
    designation: r.designation,
    bio: r.bio,
    email: r.email,
    profileUrl: r.profileUrl,
    deptName: r.deptName,
    instShort: r.instShort,
    instName: r.instName,
    pubs,
    opps,
    areas: areas.map((a) => a.name),
  });
}

async function getRelatedProfessors(slug, limit = 4) {
  const professor = await getProfessorBySlug(slug);
  if (!professor) return [];

  const areaNames = professor.researchAreas.map((a) => a.replace(/-/g, " "));
  if (!areaNames.length) return [];

  const profId = parseInt(professor.id.replace('p', '').replace(/^0+/, '')) || 0;

  const related = await prisma.$queryRawUnsafe(`
    SELECT DISTINCT p.id, p.name, p.designation, p.bio, p.email, p."profileUrl",
      d.name as "deptName",
      i."shortName" as "instShort", i.name as "instName",
      (SELECT COUNT(*)::int FROM "Publication" pub WHERE pub."professorId" = p.id) as "pubCount",
      (SELECT COUNT(*)::int FROM "Opportunity" o WHERE o."professorId" = p.id) as "oppCount",
      ARRAY(SELECT ra.name FROM "ResearchArea" ra JOIN "ProfessorResearchArea" pra ON pra."researchAreaId" = ra.id WHERE pra."professorId" = p.id) as "areas"
    FROM "Professor" p
    JOIN "Department" d ON p."departmentId" = d.id
    JOIN "Institute" i ON d."instituteId" = i.id
    JOIN "ProfessorResearchArea" pra ON pra."professorId" = p.id
    JOIN "ResearchArea" ra ON ra.id = pra."researchAreaId"
    WHERE LOWER(ra.name) = ANY($1::text[])
    AND p.id != ${profId}
    LIMIT ${limit + 5}
  `, areaNames.map((a) => a.toLowerCase()));

  return related.map((r) => transformProfessorLite(r)).slice(0, limit);
}

function transformProfessorLite(r) {
  const id = typeof r.id === "number" ? `p${String(r.id).padStart(3, "0")}` : r.id;
  const slug = professorSlug(r.name || r.profName, r.deptName);
  const iitId = slugify(r.instShort);
  const seed = hashString(id);

  const position = r.designation || inferPosition(r.name || r.profName);
  const publicationCount = r.pubCount || 0;
  const oppCount = r.oppCount || 0;
  const citationCount = publicationCount * (5 + (seed % 30));
  const hIndex = Math.floor(Math.sqrt(citationCount / 5)) || 1;
  const availability = oppCount > 0 ? inferAvailability(seed) : "closed";
  const joinedYear = 2005 + (seed % 18);
  const areas = r.areas || [];

  return {
    id,
    name: r.name || r.profName,
    slug,
    position,
    iitId,
    department: r.deptName,
    researchAreas: areas.map((a) => slugify(a)),
    bio: r.bio || generateBio(r.name || r.profName, r.deptName, areas),
    email: r.email || "",
    website: r.profileUrl || undefined,
    googleScholar: `https://scholar.google.com/citations?user=${slug}`,
    orcid: undefined,
    publicationCount,
    citationCount,
    hIndex,
    availability,
    location: getLocation(r.instName),
    joinedYear,
    timeline: [],
  };
}

function transformProfessorFull(r) {
  const id = `p${String(r.id).padStart(3, "0")}`;
  const slug = professorSlug(r.name, r.deptName);
  const iitId = slugify(r.instShort);
  const seed = hashString(id);

  const position = r.designation || inferPosition(r.name);
  const pubs = r.pubs || [];
  const opps = r.opps || [];

  const publicationCount = pubs.length;
  const citationCount = pubs.reduce(
    (sum, pub) => sum + (pub.citationCount || 0),
    0
  );
  const hIndex = Math.floor(Math.sqrt(citationCount / 5)) || 1;

  const joinedYear = 2005 + (seed % 18);
  const oppCount = opps.length;
  const availability = oppCount > 0 ? inferAvailability(seed) : "closed";
  const areas = r.areas || [];

  const timeline = [
    {
      id: `${id}-t1`,
      year: joinedYear,
      title: `Joined ${r.instShort}`,
      description: `Started as ${position} in ${r.deptName}.`,
    },
  ];

  if (publicationCount > 20) {
    timeline.push({
      id: `${id}-t2`,
      year: joinedYear + 4,
      title: "Significant Publication Milestone",
      description: `Reached ${publicationCount} publications in ${r.deptName}.`,
    });
  }

  return {
    id,
    name: r.name,
    slug,
    position,
    iitId,
    department: r.deptName,
    researchAreas: areas.map((a) => slugify(a)),
    bio: r.bio || generateBio(r.name, r.deptName, areas),
    email: r.email || "",
    website: r.profileUrl || undefined,
    googleScholar: `https://scholar.google.com/citations?user=${slug}`,
    orcid: undefined,
    publicationCount,
    citationCount,
    hIndex,
    availability,
    location: getLocation(r.instName),
    joinedYear,
    timeline,
  };
}

module.exports = {
  getAllProfessors,
  getProfessorBySlug,
  getRelatedProfessors,
};
