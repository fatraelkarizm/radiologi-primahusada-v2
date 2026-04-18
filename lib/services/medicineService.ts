import { MedicineRepository } from "../repositories/medicineRepository";
import { Medicine, Prisma } from "@prisma/client";

export class MedicineService {
     private repository: MedicineRepository;

     constructor() {
          this.repository = new MedicineRepository();
     }

     async listMedicines() {
          return await this.repository.getAll();
     }

     async getMedicine(id: number) {
          return await this.repository.getById(id);
     }

     async addMedicine(data: Prisma.MedicineCreateInput) {
          return await this.repository.create(data);
     }

     async updateMedicine(id: number, data: Prisma.MedicineUpdateInput) {
          return await this.repository.update(id, data);
     }

     async removeMedicine(id: number) {
          return await this.repository.delete(id);
     }
}
