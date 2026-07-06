import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@ecommerce.com';
  const adminPassword = 'Admin123!';

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log('Admin user already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  let role = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (!role) {
    role = await prisma.role.create({
      data: {
        name: 'ADMIN',
        description: 'Full admin access',
      },
    });
  }

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      emailVerified: new Date(),
      role: { connect: { id: role.id } },
    },
  });

  console.log('Admin user created:');
  console.log('Email:', adminEmail);
  console.log('Password:', adminPassword);

  const categories = [
    { name: 'Electronics', slug: 'electronics', icon: '📱', sortOrder: 1 },
    { name: 'Fashion', slug: 'fashion', icon: '👕', sortOrder: 2 },
    { name: 'Home & Garden', slug: 'home-garden', icon: '🏠', sortOrder: 3 },
    { name: 'Sports', slug: 'sports', icon: '⚽', sortOrder: 4 },
    { name: 'Beauty', slug: 'beauty', icon: '💄', sortOrder: 5 },
    { name: 'Toys', slug: 'toys', icon: '🧸', sortOrder: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Categories created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
