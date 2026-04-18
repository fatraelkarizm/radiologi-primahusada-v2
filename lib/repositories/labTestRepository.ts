import { prisma } from '@/lib/prisma';
import { LabTest, Prisma } from '@prisma/client';

export async function getAllLabTests() {
  return await prisma.labTest.findMany({
    include: {
      patient: true,
    },
    orderBy: { testDate: 'desc' },
  });
}

export async function getLabTestById(id: number) {
  return await prisma.labTest.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });
}

export async function createLabTest(data: Prisma.LabTestCreateInput) {
  return await prisma.labTest.create({
    data,
  });
}

export async function updateLabTest(id: number, data: Prisma.LabTestUpdateInput) {
  return await prisma.labTest.update({
    where: { id },
    data,
  });
}

export async function deleteLabTest(id: number) {
  return await prisma.labTest.delete({
    where: { id },
  });
}
