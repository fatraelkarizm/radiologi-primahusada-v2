import { prisma } from "@/lib/prisma";
import { Medicine, Prisma } from "@prisma/client";

export class MedicineRepository {
     async getAll(): Promise<Medicine[]> {
          return await prisma.medicine.findMany({
               orderBy: { name: 'asc' }
          });
     }

     async getById(id: number): Promise<Medicine | null> {
          return await prisma.medicine.findUnique({
               where: { id }
          });
     }

     async create(data: Prisma.MedicineCreateInput): Promise<Medicine> {
          return await prisma.medicine.create({ data });
     }

     async update(id: number, data: Prisma.MedicineUpdateInput): Promise<Medicine> {
          return await prisma.medicine.update({
               where: { id },
               data,
          });
     }

     async delete(id: number): Promise<Medicine> {
          return await prisma.medicine.delete({
               where: { id },
          });
     }
}
