const prisma = require("../config/db");
const {
  slugify,
  getIITMeta,
} = require("../utils/helpers");

async function getAllIITs() {
  const institutes = await prisma.institute.findMany({
    include: {
      departments: {
        include: {
          professors: {
            include: {
              researchAreas: {
                include: { researchArea: true },
              },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return institutes.map((inst) => transformIIT(inst));
}

async function getIITById(id) {
  const institutes = await prisma.institute.findMany({
    include: {
      departments: {
        include: {
          professors: {
            include: {
              researchAreas: {
                include: { researchArea: true },
              },
            },
          },
        },
      },
    },
  });

  const found = institutes.find(
    (inst) => slugify(inst.shortName) === id || slugify(inst.name) === id
  );

  return found ? transformIIT(found) : undefined;
}

function transformIIT(inst) {
  const id = slugify(inst.shortName);
  const meta = getIITMeta(inst.shortName);

  const allProfessors = inst.departments.flatMap((d) => d.professors);
  const totalProfessors = allProfessors.length;

  const areaCounts = {};
  allProfessors.forEach((p) => {
    p.researchAreas.forEach((ra) => {
      const areaSlug = slugify(ra.researchArea.name);
      if (areaSlug) {
        areaCounts[areaSlug] = (areaCounts[areaSlug] || 0) + 1;
      }
    });
  });

  const popularAreas = Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([area]) => area);

  return {
    id,
    code: inst.shortName,
    name: inst.name,
    city: meta.city,
    state: meta.state,
    established: meta.established,
    description: meta.description,
    departments: inst.departments.length,
    professorCount: totalProfessors,
    popularAreas,
    ranking: meta.ranking,
  };
}

module.exports = {
  getAllIITs,
  getIITById,
};
