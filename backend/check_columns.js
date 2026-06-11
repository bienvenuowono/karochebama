const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const columns = await prisma.$queryRaw`SHOW COLUMNS FROM product`;
  console.log("COLUMNS:", columns);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
