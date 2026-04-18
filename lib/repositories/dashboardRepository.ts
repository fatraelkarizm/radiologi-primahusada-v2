import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
  const [
    totalPatients,
    totalDoctors,
    totalLabTests,
    totalXrayExams,
    todayRegistrations,
    pendingLabTests,
    pendingXrays
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.labTest.count(),
    prisma.xRayExamination.count(),
    prisma.patient.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        }
      }
    }),
    prisma.labTest.count({
      where: { status: 'Menunggu' }
    }),
    prisma.xRayExamination.count({
      where: { status: 'Menunggu' }
    })
  ]);

  return {
    totalPatients,
    totalDoctors,
    totalLabTests,
    totalXrayExams,
    todayRegistrations,
    pendingLabTests,
    pendingXrays
  };
}
