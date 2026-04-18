import { prisma } from "@/lib/prisma";
import { Polyclinic } from "@prisma/client";

export class PolyclinicRepository {
     async getAll(): Promise<Polyclinic[]> {
          return await prisma.polyclinic.findMany({
               where: { status: "Aktif" },
               orderBy: { name: 'asc' }
          });
     }
}
