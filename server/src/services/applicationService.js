const prisma = require("../config/db");

async function getApplications(userId) {
  const apps = await prisma.application.findMany({
    where: { userId },
    include: {
      professor: {
        include: {
          department: { include: { institute: true } },
          researchAreas: { include: { researchArea: true } },
          _count: { select: { publications: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return apps.map((app) => ({
    id: app.id,
    status: app.status,
    notes: app.notes,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
    professor: {
      id: `p${String(app.professor.id).padStart(3, "0")}`,
      name: app.professor.name,
      slug: slugify(app.professor.name),
      department: app.professor.department.name,
      institute: app.professor.department.institute.shortName,
      iitId: slugify(app.professor.department.institute.shortName),
      email: app.professor.email,
      researchAreas: app.professor.researchAreas.map((ra) =>
        slugify(ra.researchArea.name)
      ),
      publicationCount: app.professor._count.publications,
    },
  }));
}

async function addApplication(userId, professorId, status, notes) {
  const profNumId = parseInt(professorId.replace("p", ""));
  if (isNaN(profNumId)) {
    const err = new Error("Invalid professor ID");
    err.status = 400;
    throw err;
  }

  const existing = await prisma.application.findUnique({
    where: { userId_professorId: { userId, professorId: profNumId } },
  });

  if (existing) {
    const updated = await prisma.application.update({
      where: { id: existing.id },
      data: { status: status || existing.status, notes: notes ?? existing.notes },
    });
    return updated;
  }

  const app = await prisma.application.create({
    data: {
      userId,
      professorId: profNumId,
      status: status || "interested",
      notes,
    },
  });
  return app;
}

async function updateApplication(userId, appId, status, notes) {
  const app = await prisma.application.findFirst({
    where: { id: appId, userId },
  });

  if (!app) {
    const err = new Error("Application not found");
    err.status = 404;
    throw err;
  }

  const updated = await prisma.application.update({
    where: { id: appId },
    data: {
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes }),
    },
  });
  return updated;
}

async function removeApplication(userId, professorId) {
  const profNumId = parseInt(professorId.replace("p", ""));
  if (isNaN(profNumId)) return;

  await prisma.application.deleteMany({
    where: { userId, professorId: profNumId },
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = {
  getApplications,
  addApplication,
  updateApplication,
  removeApplication,
};
