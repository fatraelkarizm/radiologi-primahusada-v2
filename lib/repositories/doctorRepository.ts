import { prisma } from '@/lib/prisma';
import { Doctor, Prisma } from '@prisma/client';

export async function getAllDoctors() {
  return await prisma.doctor.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDoctorById(id: number) {
  return await prisma.doctor.findUnique({
    where: { id },
  });
}

export async function createDoctor(data: Prisma.DoctorCreateInput) {
  return await prisma.doctor.create({
    data,
  });
}

export async function updateDoctor(id: number, data: Prisma.DoctorUpdateInput) {
  return await prisma.doctor.update({
    where: { id },
    data,
  });
}

export async function deleteDoctor(id: number) {
  return await prisma.doctor.delete({
    where: { id },
  });
}
