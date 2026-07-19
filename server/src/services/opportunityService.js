const prisma = require("../config/db");

async function getAllOpportunities() {
  const opps = await prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
  });

  return opps.map((opp) => transformOpportunity(opp));
}

async function getOpportunitiesByProfessor(professorId) {
  const profNumId = parseInt(professorId.replace("p", ""));
  if (isNaN(profNumId)) return [];

  const opps = await prisma.opportunity.findMany({
    where: { professorId: profNumId },
    orderBy: { createdAt: "desc" },
  });

  return opps.map((opp) => transformOpportunity(opp));
}

function transformOpportunity(opp) {
  const id = `opp${String(opp.id).padStart(4, "0")}`;
  const profId = `p${String(opp.professorId).padStart(3, "0")}`;

  const type = opp.type || "PhD Position";

  let status = "open";
  if (opp.isActive === false) {
    status = "closed";
  } else if (opp.deadline) {
    const deadline = new Date(opp.deadline);
    const now = new Date();
    const daysLeft = (deadline - now) / (1000 * 60 * 60 * 24);
    if (daysLeft < 0) status = "closed";
    else if (daysLeft < 30) status = "limited";
  }

  return {
    id,
    title: opp.title,
    type,
    professorId: profId,
    status,
    deadline: opp.deadline
      ? new Date(opp.deadline).toISOString().split("T")[0]
      : undefined,
    description: opp.description || `${opp.title} opportunity in the lab.`,
  };
}

module.exports = {
  getAllOpportunities,
  getOpportunitiesByProfessor,
};
