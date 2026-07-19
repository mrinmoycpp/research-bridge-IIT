require("dotenv").config();
const prisma = require("./config/db");

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" SERIAL PRIMARY KEY,
      "email" TEXT UNIQUE NOT NULL,
      "name" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Application" (
      "id" SERIAL PRIMARY KEY,
      "status" TEXT DEFAULT 'interested' NOT NULL,
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
      "professorId" INTEGER NOT NULL REFERENCES "Professor"("id") ON DELETE CASCADE,
      UNIQUE ("userId", "professorId")
    )
  `);

  console.log("User and Application tables created");
}

main()
  .catch((e) => {
    console.error("Failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
