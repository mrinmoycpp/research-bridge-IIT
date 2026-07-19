const prisma = require("../config/db");
const { slugify, professorSlug } = require("../utils/helpers");

async function getSearchSuggestions(query) {
  if (!query || !query.trim()) return [];

  const q = query.trim();
  const suggestions = [];

  const professors = await prisma.professor.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
    },
    include: {
      department: { include: { institute: true } },
    },
    take: 4,
  });

  professors.forEach((p) => {
    suggestions.push({
      id: `p${String(p.id).padStart(3, "0")}`,
      type: "professor",
      label: p.name,
      sublabel: `${p.department.name} · ${p.department.institute.shortName}`,
    });
  });

  const institutes = await prisma.institute.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortName: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 3,
  });

  institutes.forEach((inst) => {
    suggestions.push({
      id: slugify(inst.shortName),
      type: "iit",
      label: inst.name,
      sublabel: inst.shortName,
    });
  });

  const areas = await prisma.researchArea.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
    },
    include: {
      professors: true,
    },
    take: 3,
  });

  areas.forEach((a) => {
    suggestions.push({
      id: slugify(a.name),
      type: "area",
      label: a.name,
      sublabel: `${a.professors.length} researchers`,
    });
  });

  const pubs = await prisma.publication.findMany({
    where: {
      title: { contains: q, mode: "insensitive" },
    },
    take: 3,
  });

  pubs.forEach((pub) => {
    suggestions.push({
      id: `pub${String(pub.id).padStart(4, "0")}`,
      type: "publication",
      label: pub.title,
      sublabel: `${pub.journal || "Conference"} · ${pub.year || "N/A"}`,
    });
  });

  return suggestions;
}

module.exports = {
  getSearchSuggestions,
};
