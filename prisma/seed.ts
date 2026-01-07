import { PrismaClient } from '@prisma/client';
import {
     seedUsers,
     seedDoctors,
     seedPatients,
     seedPolyclinics,
     seedMedicines,
     seedSettings,
} from './seeders';

const prisma = new PrismaClient();

async function main() {
     console.log('🌱 Starting database seeding...\n');

     try {
          // Seed in order of dependencies
          await seedSettings();
          await seedUsers();
          await seedPolyclinics();
          await seedDoctors();
          await seedPatients();
          await seedMedicines();

          console.log('\n✅ Database seeding completed successfully!');
     } catch (error) {
          console.error('❌ Error during seeding:', error);
          throw error;
     }
}

main()
     .catch((e) => {
          console.error(e);
          process.exit(1);
     })
     .finally(async () => {
          await prisma.$disconnect();
     });
