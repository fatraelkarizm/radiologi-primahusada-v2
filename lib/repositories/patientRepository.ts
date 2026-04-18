import { prisma } from '@/lib/prisma';
import { Patient, Prisma } from '@prisma/client';

export async function getAllPatients() {
  return await prisma.patient.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPatientById(id: number) {
  return await prisma.patient.findUnique({
    where: { id },
  });
}

export async function getPatientByRegistrationNo(registrationNo: string) {
  return await prisma.patient.findUnique({
    where: { registrationNo },
  });
}

export async function createPatient(data: Prisma.PatientCreateInput) {
  return await prisma.patient.create({
    data,
  });
}

export async function updatePatient(id: number, data: Prisma.PatientUpdateInput) {
  return await prisma.patient.update({
    where: { id },
    data,
  });
}

export async function deletePatient(id: number) {
  return await prisma.patient.delete({
    where: { id },
  });
}
