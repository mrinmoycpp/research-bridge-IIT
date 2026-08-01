const prisma = require("../config/db");
const {
  slugify,
  hashString,
  seededRandom,
  TRENDING_TOPICS,
} = require("../utils/helpers");

async function getAllResearchAreas() {
  const areas = await prisma.$queryRaw`
    SELECT ra.id, ra.name, ra.description,
      (SELECT COUNT(*)::int FROM "ProfessorResearchArea" pra WHERE pra."researchAreaId" = ra.id) as "profCount"
    FROM "ResearchArea" ra
    ORDER BY ra.name ASC
  `;

  return areas.map((area) => transformResearchAreaLite(area));
}

async function getResearchAreaBySlug(slug) {
  const areaName = slug.replace(/-/g, " ");

  const rows = await prisma.$queryRaw`
    SELECT ra.id, ra.name, ra.description
    FROM "ResearchArea" ra
    WHERE LOWER(ra.name) = LOWER(${areaName})
    LIMIT 1
  `;

  if (!rows.length) {
    const all = await prisma.$queryRaw`SELECT ra.id, ra.name, ra.description FROM "ResearchArea" ra`;
    const match = all.find((a) => slugify(a.name) === slug);
    if (!match) return undefined;
    return buildFullArea(match.id, match.name, match.description);
  }

  return buildFullArea(rows[0].id, rows[0].name, rows[0].description);
}

async function buildFullArea(areaId, areaName, areaDesc) {
  const id = slugify(areaName);
  const seed = hashString(areaName);
  const rand = seededRandom(seed);

  const [profCountResult, pubResult] = await Promise.all([
    prisma.$queryRaw`
      SELECT COUNT(*)::int as count FROM "ProfessorResearchArea" WHERE "researchAreaId" = ${areaId}
    `,
    prisma.$queryRaw`
      SELECT COUNT(*)::int as count
      FROM "Publication" p
      INNER JOIN "ProfessorResearchArea" pra ON pra."professorId" = p."professorId"
      WHERE pra."researchAreaId" = ${areaId}
    `,
  ]);

  const professorCount = profCountResult[0]?.count || 0;
  const publicationCount = pubResult[0]?.count || 0;

  const numTopics = 3 + Math.floor(rand() * 3);
  const shuffled = [...TRENDING_TOPICS].sort(() => rand() - 0.5);
  const trendingTopics = shuffled.slice(0, numTopics);

  return {
    id,
    name: areaName,
    slug: id,
    description:
      areaDesc ||
      `${areaName} is an active research domain spanning theoretical foundations and applied engineering, with ${professorCount} researchers contributing to the field.`,
    trendingTopics,
    professorCount,
    publicationCount,
  };
}

function transformResearchAreaLite(area) {
  const id = slugify(area.name);
  const seed = hashString(area.name);
  const rand = seededRandom(seed);

  const professorCount = area.profCount || 0;
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

module.exports = {
  getAllResearchAreas,
  getResearchAreaBySlug,
};
