import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
     console.log('Seeding users...');

     const hashedPassword = await bcrypt.hash('admin123', 10);

     const admin = await prisma.user.upsert({
          where: { email: 'admin@primahusada.com' },
          update: {},
          create: {
               email: 'admin@primahusada.com',
               name: 'Administrator',
               password: hashedPassword,
               role: 'ADMIN',
               status: 'active',
          },
     });

     const receptionist = await prisma.user.upsert({
          where: { email: 'receptionist@primahusada.com' },
          update: {},
          create: {
               email: 'receptionist@primahusada.com',
               name: 'Resepsionis Klinik',
               password: await bcrypt.hash('receptionist123', 10),
               role: 'RECEPTIONIST',
               status: 'active',
          },
     });

     const pharmacist = await prisma.user.upsert({
          where: { email: 'pharmacist@primahusada.com' },
          update: {},
          create: {
               email: 'pharmacist@primahusada.com',
               name: 'Apoteker',
               password: await bcrypt.hash('pharmacist123', 10),
               role: 'PHARMACIST',
               status: 'active',
          },
     });

     console.log('✓ Users seeded');
     return { admin, receptionist, pharmacist };
}

async function seedDoctors() {
     console.log('Seeding doctors...');

     const doctors = await Promise.all([
          prisma.doctor.upsert({
               where: { licenseNumber: 'SIP-001-2024' },
               update: {},
               create: {
                    name: 'dr. Andi Wijaya, Sp.PD',
                    specialization: 'Penyakit Dalam',
                    licenseNumber: 'SIP-001-2024',
                    phone: '081234567890',
                    email: 'andi.wijaya@primahusada.com',
                    experience: 10,
                    status: 'Aktif',
               },
          }),
          prisma.doctor.upsert({
               where: { licenseNumber: 'SIP-002-2024' },
               update: {},
               create: {
                    name: 'drg. Budi Santoso',
                    specialization: 'Gigi',
                    licenseNumber: 'SIP-002-2024',
                    phone: '081234567891',
                    email: 'budi.santoso@primahusada.com',
                    experience: 7,
                    status: 'Aktif',
               },
          }),
          prisma.doctor.upsert({
               where: { licenseNumber: 'SIP-003-2024' },
               update: {},
               create: {
                    name: 'dr. Siti Aminah, Sp.OG',
                    specialization: 'Kebidanan',
                    licenseNumber: 'SIP-003-2024',
                    phone: '081234567892',
                    email: 'siti.aminah@primahusada.com',
                    experience: 12,
                    status: 'Aktif',
               },
          }),
          prisma.doctor.upsert({
               where: { licenseNumber: 'SIP-004-2024' },
               update: {},
               create: {
                    name: 'dr. Rizki Ramadhan, Sp.Rad',
                    specialization: 'Radiologi',
                    licenseNumber: 'SIP-004-2024',
                    phone: '081234567893',
                    email: 'rizki.ramadhan@primahusada.com',
                    experience: 8,
                    status: 'Aktif',
               },
          }),
     ]);

     console.log('✓ Doctors seeded');
     return doctors;
}

async function seedPatients() {
     console.log('Seeding patients...');

     const patients = await Promise.all([
          prisma.patient.create({
               data: {
                    registrationNo: 'RM-2024-0001',
                    nik: '3201010101900001',
                    bpjsNo: '0001234567890',
                    name: 'Budi Setiawan',
                    birthDate: new Date('1990-01-01'),
                    birthPlace: 'Jakarta',
                    gender: 'L',
                    phone: '081298765432',
                    email: 'budi.setiawan@email.com',
                    address: 'Jl. Merdeka No. 123, Jakarta Pusat',
                    occupation: 'Pegawai Swasta',
                    maritalStatus: 'Menikah',
                    religion: 'Islam',
                    bloodType: 'O',
               },
          }),
          prisma.patient.create({
               data: {
                    registrationNo: 'RM-2024-0002',
                    nik: '3201010201850002',
                    name: 'Dewi Kusuma',
                    birthDate: new Date('1985-02-15'),
                    birthPlace: 'Bandung',
                    gender: 'P',
                    phone: '081298765433',
                    address: 'Jl. Sudirman No. 45, Jakarta Selatan',
                    occupation: 'Guru',
                    maritalStatus: 'Menikah',
                    religion: 'Kristen',
                    bloodType: 'A',
               },
          }),
          prisma.patient.create({
               data: {
                    registrationNo: 'RM-2024-0003',
                    nik: '3201010301950003',
                    name: 'Ahmad Fauzi',
                    birthDate: new Date('1995-03-20'),
                    birthPlace: 'Surabaya',
                    gender: 'L',
                    phone: '081298765434',
                    address: 'Jl. Gatot Subroto No. 78, Jakarta Barat',
                    occupation: 'Wiraswasta',
                    maritalStatus: 'Belum Menikah',
                    religion: 'Islam',
                    bloodType: 'B',
               },
          }),
     ]);

     console.log('✓ Patients seeded');
     return patients;
}

async function seedPolyclinics() {
     console.log('Seeding polyclinics...');

     const polyclinics = await Promise.all([
          prisma.polyclinic.upsert({
               where: { code: 'POLI-UMUM' },
               update: {},
               create: {
                    name: 'Poli Umum',
                    code: 'POLI-UMUM',
                    operatingHours: '08:00-16:00',
                    status: 'Aktif',
               },
          }),
          prisma.polyclinic.upsert({
               where: { code: 'POLI-GIGI' },
               update: {},
               create: {
                    name: 'Poli Gigi',
                    code: 'POLI-GIGI',
                    operatingHours: '09:00-15:00',
                    status: 'Aktif',
               },
          }),
          prisma.polyclinic.upsert({
               where: { code: 'POLI-KIA' },
               update: {},
               create: {
                    name: 'Poli KIA (Kebidanan)',
                    code: 'POLI-KIA',
                    operatingHours: '08:00-14:00',
                    status: 'Aktif',
               },
          }),
     ]);

     console.log('✓ Polyclinics seeded');
     return polyclinics;
}

async function seedMedicines() {
     console.log('Seeding medicines...');

     const medicines = await Promise.all([
          prisma.medicine.create({
               data: {
                    code: 'MED-001',
                    name: 'Paracetamol 500mg',
                    category: 'Tablet',
                    unit: 'Strip',
                    purchasePrice: 3000,
                    sellingPrice: 5000,
                    stock: 100,
                    minStock: 20,
                    manufacturer: 'PT. Kimia Farma',
               },
          }),
          prisma.medicine.create({
               data: {
                    code: 'MED-002',
                    name: 'Amoxicillin 500mg',
                    category: 'Kapsul',
                    unit: 'Strip',
                    purchasePrice: 8000,
                    sellingPrice: 12000,
                    stock: 50,
                    minStock: 10,
                    manufacturer: 'PT. Kalbe Farma',
               },
          }),
          prisma.medicine.create({
               data: {
                    code: 'MED-003',
                    name: 'OBH Combi Batuk',
                    category: 'Sirup',
                    unit: 'Botol',
                    purchasePrice: 15000,
                    sellingPrice: 22000,
                    stock: 30,
                    minStock: 5,
                    manufacturer: 'PT. Indofarma',
               },
          }),
     ]);

     console.log('✓ Medicines seeded');
     return medicines;
}

async function seedSettings() {
     console.log('Seeding settings...');

     const clinic = await prisma.clinic.upsert({
          where: { id: 1 },
          update: {},
          create: {
               name: 'Klinik Prima Husada',
               address: 'Jl. Kesehatan No. 1, Jakarta Pusat',
               phone: '021-12345678',
               email: 'info@primahusada.com',
               website: 'https://primahusada.com',
          },
     });

     const insurances = await Promise.all([
          prisma.insurance.upsert({
               where: { code: 'BPJS' },
               update: {},
               create: {
                    name: 'BPJS Kesehatan',
                    code: 'BPJS',
                    type: 'Government',
                    status: 'Aktif',
               },
          }),
          prisma.insurance.upsert({
               where: { code: 'MANDIRI' },
               update: {},
               create: {
                    name: 'Asuransi Mandiri Inhealth',
                    code: 'MANDIRI',
                    type: 'Private',
                    status: 'Aktif',
               },
          }),
     ]);

     const services = await Promise.all([
          prisma.service.upsert({
               where: { code: 'KONSUL-001' },
               update: {},
               create: {
                    code: 'KONSUL-001',
                    name: 'Konsultasi Dokter Umum',
                    category: 'Konsultasi',
                    price: 50000,
               },
          }),
          prisma.service.upsert({
               where: { code: 'KONSUL-002' },
               update: {},
               create: {
                    code: 'KONSUL-002',
                    name: 'Konsultasi Dokter Spesialis',
                    category: 'Konsultasi',
                    price: 150000,
               },
          }),
          prisma.service.upsert({
               where: { code: 'LAB-001' },
               update: {},
               create: {
                    code: 'LAB-001',
                    name: 'Pemeriksaan Darah Lengkap',
                    category: 'Laboratorium',
                    price: 75000,
               },
          }),
     ]);

     console.log('✓ Settings seeded');
     return { clinic, insurances, services };
}

export {
     seedUsers,
     seedDoctors,
     seedPatients,
     seedPolyclinics,
     seedMedicines,
     seedSettings
};
