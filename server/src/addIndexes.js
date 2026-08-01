require("dotenv").config();
const prisma = require("./config/db");

async function main() {
  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_professor_department ON "Professor"("departmentId")`,
    `CREATE INDEX IF NOT EXISTS idx_department_institute ON "Department"("instituteId")`,
    `CREATE INDEX IF NOT EXISTS idx_publication_professor ON "Publication"("professorId")`,
    `CREATE INDEX IF NOT EXISTS idx_opportunity_professor ON "Opportunity"("professorId")`,
    `CREATE INDEX IF NOT EXISTS idx_pra_professor ON "ProfessorResearchArea"("professorId")`,
    `CREATE INDEX IF NOT EXISTS idx_pra_area ON "ProfessorResearchArea"("researchAreaId")`,
    `CREATE INDEX IF NOT EXISTS idx_professor_name ON "Professor" USING gin (name gin_trgm_ops)`,
    `CREATE INDEX IF NOT EXISTS idx_institute_shortname ON "Institute"("shortName")`,
  ];

  for (const sql of indexes) {
    try {
      await prisma.$executeRawUnsafe(sql);
      const name = sql.match(/idx_\w+/)?.[0] || "unknown";
      console.log(`Created: ${name}`);
    } catch (e) {
      if (e.message.includes("already exists")) {
        console.log(`Already exists: ${sql.match(/idx_\w+/)?.[0]}`);
      } else {
        console.log(`Error: ${e.message}`);
      }
    }
  }

  console.log("Done");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
