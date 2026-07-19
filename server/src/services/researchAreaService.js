const prisma = require("../config/db");
const {
  slugify,
  hashString,
  seededRandom,
  TRENDING_TOPICS,
} = require("../utils/helpers");

async function getAllResearchAreas() {
  const areas = await prisma.researchArea.findMany({
    include: {
      _count: { select: { professors: true } },
    },
    orderBy: { name: "asc" },
  });

  return areas.map((area) => transformResearchAreaLite(area));
}

async function getResearchAreaBySlug(slug) {
  const area = await prisma.researchArea.findFirst({
    where: {
      name: {
        equals: slug.replace(/-/g, " "),
        mode: "insensitive",
      },
    },
    include: {
      professors: true,
    },
  });

  if (!area) {
    const all = await prisma.researchArea.findMany({ include: { professors: true } });
    const found = all.find((a) => slugify(a.name) === slug);
    return found ? transformResearchAreaFull(found) : undefined;
  }

  return transformResearchAreaFull(area);
}

function transformResearchAreaLite(area) {
  const id = slugify(area.name);
  const seed = hashString(area.name);
  const rand = seededRandom(seed);

  const professorCount = area._count?.professors || 0;
  const publicationCount = professorCount * (3 + (seed % 5));

  const numTopics = 3 + Math.floor(rand() * 3);
  const shuffled = [...TRENDING_TOPICS].sort(() => rand() - 0.5);
  const trendingTopics = shuffled.slice(0, numTopics);

  return {
    id,
    name: area.name,
    slug: id,
    description:
      area.description ||
      `${area.name} is an active research domain spanning theoretical foundations and applied engineering, with ${professorCount} researchers contributing to the field.`,
    trendingTopics,
    professorCount,
    publicationCount,
  };
}

async function transformResearchAreaFull(area) {
  const id = slugify(area.name);
  const seed = hashString(area.name);
  const rand = seededRandom(seed);

  const professorCount = area.professors.length;

  const pubResult = await prisma.$queryRaw`
    SELECT COUNT(*)::int as count
    FROM "Publication" p
    INNER JOIN "ProfessorResearchArea" pra ON pra."professorId" = p."professorId"
    WHERE pra."researchAreaId" = ${area.id}
  `;
  const publicationCount = pubResult[0]?.count || 0;

  const numTopics = 3 + Math.floor(rand() * 3);
  const shuffled = [...TRENDING_TOPICS].sort(() => rand() - 0.5);
  const trendingTopics = shuffled.slice(0, numTopics);

  return {
    id,
    name: area.name,
    slug: id,
    description:
      area.description ||
      `${area.name} is an active research domain spanning theoretical foundations and applied engineering, with ${professorCount} researchers contributing to the field.`,
    trendingTopics,
    professorCount,
    publicationCount,
  };
}

module.exports = {
  getAllResearchAreas,
  getResearchAreaBySlug,
};
