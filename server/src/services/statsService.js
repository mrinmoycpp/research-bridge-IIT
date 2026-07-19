const prisma = require("../config/db");

async function getPlatformStats() {
  const [iitCount, professorCount, departmentCount, areaCount] =
    await Promise.all([
      prisma.institute.count(),
      prisma.professor.count(),
      prisma.department.count(),
      prisma.researchArea.count(),
    ]);

  return {
    iits: iitCount,
    professors: professorCount,
    departments: departmentCount,
    researchAreas: areaCount,
  };
}

module.exports = {
  getPlatformStats,
};
