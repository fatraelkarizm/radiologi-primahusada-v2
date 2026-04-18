import { MedicalRecordRepository } from "../repositories/medicalRecordRepository";
import { MedicalRecord, Prisma } from "@prisma/client";

export class MedicalRecordService {
     private repository: MedicalRecordRepository;

     constructor() {
          this.repository = new MedicalRecordRepository();
     }

     async listAllRecords() {
          return await this.repository.getAll();
     }

     async getRecordDetail(id: number) {
          return await this.repository.getById(id);
     }

     async createNewRecord(data: {
          patientId: number;
          doctorId: number;
          chiefComplaint?: string;
          diagnosis?: string;
          icdCode?: string;
          treatment?: string;
          notes?: string;
     }) {
          return await this.repository.create({
               patient: { connect: { id: data.patientId } },
               doctor: { connect: { id: data.doctorId } },
               chiefComplaint: data.chiefComplaint,
               diagnosis: data.diagnosis,
               icdCode: data.icdCode,
               treatment: data.treatment,
               notes: data.notes
          });
     }
}
