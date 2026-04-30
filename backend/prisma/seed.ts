import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Start Seeding ---');
  
  // 1. Create Admin
  const hashedPassword = await bcrypt.hash('Admin2024!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@karochebama.com' },
    update: {},
    create: {
      email: 'admin@karochebama.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Karochebama',
      role: 'ADMIN',
    },
  });

  // 2. Create Product Types
  const types = ['Agricole', 'Agro-industriel', 'Piscicole'];
  const createdTypes = [];
  for (const name of types) {
    const t = await prisma.productType.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    createdTypes.push(t);
  }
  console.log('Product Types created:', types.join(', '));

  // 3. Create Geographic Zones
  const zones = ['Centre', 'Littoral', 'Ouest', 'Sud', 'Est'];
  for (const name of zones) {
    await prisma.geographicZone.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }
  console.log('Geographic Zones created.');

  console.log('--- Seed Completed ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
