const prisma = require("../config/db");
const {
  slugify,
  getIITMeta,
} = require("../utils/helpers");

async function getAllIITs() {
  const instituteRows = await prisma.$queryRaw`
    SELECT i.id, i."shortName", i.name,
      (SELECT COUNT(*)::int FROM "Department" d WHERE d."instituteId" = i.id) as "deptCount",
      (SELECT COUNT(*)::int FROM "Professor" p JOIN "Department" d ON p."departmentId" = d.id WHERE d."instituteId" = i.id) as "profCount"
    FROM "Institute" i
    ORDER BY i.name ASC
  `;

  return instituteRows.map((inst) => {
    const meta = getIITMeta(inst.shortName);
    return {
      id: slugify(inst.shortName),
      code: inst.shortName,
      name: inst.name,
      city: meta.city,
      state: meta.state,
      established: meta.established,
      description: meta.description,
      departments: inst.deptCount,
      professorCount: inst.profCount,
      popularAreas: [],
      ranking: meta.ranking,
    };
  });
}

async function getIITById(id) {
  const normalizedId = id.replace(/-/g, " ");

  const rows = await prisma.$queryRaw`
    SELECT i.id, i."shortName", i.name,
      (SELECT COUNT(*)::int FROM "Department" d WHERE d."instituteId" = i.id) as "deptCount",
      (SELECT COUNT(*)::int FROM "Professor" p JOIN "Department" d ON p."departmentId" = d.id WHERE d."instituteId" = i.id) as "profCount"
    FROM "Institute" i
    WHERE LOWER(i."shortName") = LOWER(${normalizedId})
       OR LOWER(REPLACE(i."shortName", ' ', '-')) = LOWER(${id})
       OR LOWER(i.name) LIKE LOWER(${`%${normalizedId}%`})
    LIMIT 1
  `;

  if (!rows.length) return undefined;

  const inst = rows[0];
  const meta = getIITMeta(inst.shortName);

  return {
    id: slugify(inst.shortName),
    code: inst.shortName,
    name: inst.name,
    city: meta.city,
    state: meta.state,
    established: meta.established,
    description: meta.description,
    departments: inst.deptCount,
    professorCount: inst.profCount,
    popularAreas: [],
    ranking: meta.ranking,
  };
}

module.exports = {
  getAllIITs,
  getIITById,
};
