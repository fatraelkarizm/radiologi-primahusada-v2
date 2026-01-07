const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
     const password = await bcrypt.hash('admin123', 10);

     const user = await prisma.user.upsert({
          where: { email: 'admin@radiocare.com' },
          update: {},
          create: {
               email: 'admin@radiocare.com',
               name: 'Admin Radiologi',
               password: 'admin123',
               role: 'ADMIN',
          },
     });

     console.log({ user });
}

main()
     .then(async () => {
          await prisma.$disconnect();
     })
     .catch(async (e) => {
          console.error(e);
          await prisma.$disconnect();
          process.exit(1);
     });
