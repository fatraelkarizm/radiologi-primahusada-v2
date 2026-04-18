import { prisma } from '@/lib/prisma';
import { XRayExamination, Prisma } from '@prisma/client';

export async function getAllXRayExams() {
  return await prisma.xRayExamination.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: { examinationDate: 'desc' },
  });
}

export async function getXRayExamById(id: number) {
  return await prisma.xRayExamination.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });
}

export async function createXRayExam(data: Prisma.XRayExaminationCreateInput) {
  return await prisma.xRayExamination.create({
    data,
  });
}

export async function updateXRayExam(id: number, data: Prisma.XRayExaminationUpdateInput) {
  return await prisma.xRayExamination.update({
    where: { id },
    data,
  });
}

export async function deleteXRayExam(id: number) {
  return await prisma.xRayExamination.delete({
    where: { id },
  });
}
