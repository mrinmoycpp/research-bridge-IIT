const prisma = require("../config/db");
const { slugify } = require("../utils/helpers");

async function getAllPublications() {
  const pubs = await prisma.$queryRaw`
    SELECT pub.id, pub.title, pub.journal, pub.year, pub."citationCount", pub.doi,
      p.name as "profName",
      d.name as "deptName",
      i."shortName" as "instShort"
    FROM "Publication" pub
    LEFT JOIN "Professor" p ON pub."professorId" = p.id
    LEFT JOIN "Department" d ON p."departmentId" = d.id
    LEFT JOIN "Institute" i ON d."instituteId" = i.id
    ORDER BY pub.year DESC NULLS LAST
    LIMIT 500
  `;

  return pubs.map((pub) => transformPublication(pub));
}

async function getPublicationsByProfessor(professorId) {
  const profNumId = parseInt(professorId.replace("p", "").replace(/^0+/, ""));
  if (isNaN(profNumId)) return [];

  const pubs = await prisma.$queryRaw`
    SELECT pub.id, pub.title, pub.journal, pub.year, pub."citationCount", pub.doi,
      p.name as "profName",
      d.name as "deptName",
      i."shortName" as "instShort"
    FROM "Publication" pub
    LEFT JOIN "Professor" p ON pub."professorId" = p.id
    LEFT JOIN "Department" d ON p."departmentId" = d.id
    LEFT JOIN "Institute" i ON d."instituteId" = i.id
    WHERE pub."professorId" = ${profNumId}
    ORDER BY pub.year DESC NULLS LAST
  `;

  return pubs.map((pub) => transformPublication(pub));
}

function transformPublication(pub) {
  const id = `pub${String(pub.id).padStart(4, "0")}`;
  const authors = pub.profName ? [pub.profName] : [];
  const areaId = pub.deptName ? slugify(pub.deptName) : "general";

  return {
    id,
    title: pub.title,
    year: pub.year || 2024,
    venue: pub.journal || "Conference Proceedings",
    authors,
    citationCount: pub.citationCount || 0,
    doi: pub.doi || undefined,
    areaId,
  };
}

module.exports = {
  getAllPublications,
  getPublicationsByProfessor,
};
