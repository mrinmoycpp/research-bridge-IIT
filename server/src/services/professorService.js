const prisma = require("../config/db");
const {
  slugify,
  professorSlug,
  hashString,
  seededRandom,
  inferPosition,
  inferAvailability,
  generateBio,
  getLocation,
  getIITMeta,
} = require("../utils/helpers");

async function getAllProfessors(filters = {}, sort = "relevance") {
  const where = {};

  if (filters.iit) {
    const allInstitutes = await prisma.institute.findMany();
    const matchedInst = allInstitutes.find(
      (i) => slugify(i.shortName) === filters.iit || i.shortName.toLowerCase() === filters.iit.toLowerCase()
    );
    if (matchedInst) {
      where.department = {
        instituteId: matchedInst.id,
      };
    } else {
      where.department = {
        institute: {
          shortName: { contains: filters.iit, mode: "insensitive" },
        },
      };
    }
  }

  if (filters.department) {
    where.department = {
      ...where.department,
      name: { contains: filters.department, mode: "insensitive" },
    };
  }

  if (filters.query) {
    where.OR = [
      { name: { contains: filters.query, mode: "insensitive" } },
      { department: { name: { contains: filters.query, mode: "insensitive" } } },
      { bio: { contains: filters.query, mode: "insensitive" } },
      {
        researchAreas: {
          some: {
            researchArea: {
              name: { contains: filters.query, mode: "insensitive" },
            },
          },
        },
      },
    ];
  }

  if (filters.researchArea) {
    where.researchAreas = {
      some: {
        researchArea: {
          name: {
            contains: filters.researchArea.replace(/-/g, " "),
            mode: "insensitive",
          },
        },
      },
    };
  }

  if (filters.position) {
    where.designation = { contains: filters.position, mode: "insensitive" };
  }

  const professors = await prisma.professor.findMany({
    where,
    include: {
      department: {
        include: { institute: true },
      },
      researchAreas: {
        include: { researchArea: true },
      },
      _count: {
        select: {
          publications: true,
          opportunities: true,
        },
      },
    },
  });

  let results = professors.map((p) => transformProfessorLite(p));

  if (filters.location) {
    results = results.filter((p) =>
      p.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.availability) {
    results = results.filter((p) => p.availability === filters.availability);
  }

  switch (sort) {
    case "citations":
      results.sort((a, b) => b.citationCount - a.citationCount);
      break;
    case "publications":
      results.sort((a, b) => b.publicationCount - a.publicationCount);
      break;
    case "name-asc":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "recent":
      results.sort((a, b) => b.joinedYear - a.joinedYear);
      break;
    default:
      break;
  }

  return results;
}

async function getProfessorBySlug(slug) {
  const professors = await prisma.professor.findMany({
    include: {
      department: {
        include: { institute: true },
      },
      researchAreas: {
        include: { researchArea: true },
      },
      publications: true,
      opportunities: true,
    },
  });

  const prof = professors.find(
    (p) => professorSlug(p.name, p.department.name) === slug
  );

  return prof ? transformProfessorFull(prof) : undefined;
}

async function getRelatedProfessors(slug, limit = 4) {
  const professor = await getProfessorBySlug(slug);
  if (!professor) return [];

  const all = await prisma.professor.findMany({
    include: {
      department: {
        include: { institute: true },
      },
      researchAreas: {
        include: { researchArea: true },
      },
      _count: {
        select: { publications: true, opportunities: true },
      },
    },
  });

  const related = all
    .filter((p) => professorSlug(p.name, p.department.name) !== slug)
    .map((p) => {
      const transformed = transformProfessorLite(p);
      const overlap = transformed.researchAreas.filter((a) =>
        professor.researchAreas.includes(a)
      ).length;
      return { professor: transformed, overlap };
    })
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((r) => r.professor);

  return related;
}

function transformProfessorLite(p) {
  const id = `p${String(p.id).padStart(3, "0")}`;
  const slug = professorSlug(p.name, p.department.name);
  const iitId = slugify(p.department.institute.shortName);
  const seed = hashString(id);

  const position = p.designation || inferPosition(p.name);
  const publicationCount = p._count?.publications || 0;
  const oppCount = p._count?.opportunities || 0;
  const citationCount = publicationCount * (5 + (seed % 30));
  const hIndex = Math.floor(Math.sqrt(citationCount / 5)) || 1;
  const availability = oppCount > 0 ? inferAvailability(seed) : "closed";
  const joinedYear = 2005 + (seed % 18);

  return {
    id,
    name: p.name,
    slug,
    position,
    iitId,
    department: p.department.name,
    researchAreas: p.researchAreas.map((ra) => slugify(ra.researchArea.name)),
    bio: p.bio || generateBio(p.name, p.department.name, p.researchAreas.map((ra) => ra.researchArea.name)),
    email: p.email || "",
    website: p.profileUrl || undefined,
    googleScholar: `https://scholar.google.com/citations?user=${slug}`,
    orcid: undefined,
    publicationCount,
    citationCount,
    hIndex,
    availability,
    location: getLocation(p.department.institute.name),
    joinedYear,
    timeline: [],
  };
}

function transformProfessorFull(p) {
  const id = `p${String(p.id).padStart(3, "0")}`;
  const slug = professorSlug(p.name, p.department.name);
  const iitId = slugify(p.department.institute.shortName);
  const seed = hashString(id);

  const position = p.designation || inferPosition(p.name);

  const publicationCount = p.publications.length;
  const citationCount = p.publications.reduce(
    (sum, pub) => sum + (pub.citationCount || 0),
    0
  );
  const hIndex = Math.floor(Math.sqrt(citationCount / 5)) || 1;

  const joinedYear = 2005 + (seed % 18);
  const oppCount = p.opportunities.length;
  const availability = oppCount > 0 ? inferAvailability(seed) : "closed";

  const timeline = [
    {
      id: `${id}-t1`,
      year: joinedYear,
      title: `Joined ${p.department.institute.shortName}`,
      description: `Started as ${position} in ${p.department.name}.`,
    },
  ];

  if (publicationCount > 20) {
    timeline.push({
      id: `${id}-t2`,
      year: joinedYear + 4,
      title: "Significant Publication Milestone",
      description: `Reached ${publicationCount} publications in ${p.department.name}.`,
    });
  }

  return {
    id,
    name: p.name,
    slug,
    position,
    iitId,
    department: p.department.name,
    researchAreas: p.researchAreas.map((ra) => slugify(ra.researchArea.name)),
    bio: p.bio || generateBio(p.name, p.department.name, p.researchAreas.map((ra) => ra.researchArea.name)),
    email: p.email || "",
    website: p.profileUrl || undefined,
    googleScholar: `https://scholar.google.com/citations?user=${slug}`,
    orcid: undefined,
    publicationCount,
    citationCount,
    hIndex,
    availability,
    location: getLocation(p.department.institute.name),
    joinedYear,
    timeline,
  };
}

module.exports = {
  getAllProfessors,
  getProfessorBySlug,
  getRelatedProfessors,
};
