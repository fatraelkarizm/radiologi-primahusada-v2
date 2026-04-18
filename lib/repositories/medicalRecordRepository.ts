import { prisma } from "@/lib/prisma";
import { MedicalRecord, Prisma } from "@prisma/client";

export class MedicalRecordRepository {
     async getAll(): Promise<MedicalRecord[]> {
          return await prisma.medicalRecord.findMany({
               include: {
                    patient: true,
                    doctor: true,
                    prescriptions: {
                         include: {
                              medicine: true
                         }
                    }
               },
               orderBy: { visitDate: 'desc' }
          });
     }

     async getById(id: number): Promise<MedicalRecord | null> {
          return await prisma.medicalRecord.findUnique({
               where: { id },
               include: {
                    patient: true,
                    doctor: true,
                    prescriptions: {
                         include: {
                              medicine: true
                         }
                    }
               }
          });
     }

     async create(data: Prisma.MedicalRecordCreateInput): Promise<MedicalRecord> {
          return await prisma.medicalRecord.create({ data });
     }

     async update(id: number, data: Prisma.MedicalRecordUpdateInput): Promise<MedicalRecord> {
          return await prisma.medicalRecord.update({
               where: { id },
               data,
          });
     }

     async delete(id: number): Promise<MedicalRecord> {
          return await prisma.medicalRecord.delete({
               where: { id },
          });
     }
}
