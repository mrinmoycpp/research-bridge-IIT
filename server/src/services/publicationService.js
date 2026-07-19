const prisma = require("../config/db");
const { slugify } = require("../utils/helpers");

async function getAllPublications() {
  const pubs = await prisma.publication.findMany({
    include: {
      professor: {
        include: {
          department: { include: { institute: true } },
        },
      },
    },
    orderBy: { year: "desc" },
  });

  return pubs.map((pub) => transformPublication(pub));
}

async function getPublicationsByProfessor(professorId) {
  const profNumId = parseInt(professorId.replace("p", ""));
  if (isNaN(profNumId)) return [];

  const pubs = await prisma.publication.findMany({
    where: { professorId: profNumId },
    include: {
      professor: {
        include: {
          department: { include: { institute: true } },
        },
      },
    },
    orderBy: { year: "desc" },
  });

  return pubs.map((pub) => transformPublication(pub));
}

function transformPublication(pub) {
  const id = `pub${String(pub.id).padStart(4, "0")}`;

  const authors = pub.professor
    ? [pub.professor.name]
    : [];

  const areaId = pub.professor
    ? slugify(pub.professor.department?.name || "general")
    : "general";

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
