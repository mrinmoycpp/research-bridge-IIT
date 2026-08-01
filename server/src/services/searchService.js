const prisma = require("../config/db");
const { slugify } = require("../utils/helpers");

async function getSearchSuggestions(query) {
  if (!query || !query.trim()) return [];

  const q = query.trim();

  const [professors, institutes, areas, pubs] = await Promise.all([
    prisma.professor.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
      },
      include: {
        department: { include: { institute: true } },
      },
      take: 4,
    }),
    prisma.institute.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { shortName: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 3,
    }),
    prisma.researchArea.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
      },
      include: {
        professors: true,
      },
      take: 3,
    }),
    prisma.publication.findMany({
      where: {
        title: { contains: q, mode: "insensitive" },
      },
      take: 3,
    }),
  ]);

  const suggestions = [];

  professors.forEach((p) => {
    suggestions.push({
      id: `p${String(p.id).padStart(3, "0")}`,
      type: "professor",
      label: p.name,
      sublabel: `${p.department.name} · ${p.department.institute.shortName}`,
    });
  });

  institutes.forEach((inst) => {
    suggestions.push({
      id: slugify(inst.shortName),
      type: "iit",
      label: inst.name,
      sublabel: inst.shortName,
    });
  });

  areas.forEach((a) => {
    suggestions.push({
      id: slugify(a.name),
      type: "area",
      label: a.name,
      sublabel: `${a.professors.length} researchers`,
    });
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
