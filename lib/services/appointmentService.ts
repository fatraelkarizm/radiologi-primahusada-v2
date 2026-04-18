import { AppointmentRepository } from "../repositories/appointmentRepository";
import { Appointment, Prisma } from "@prisma/client";

export class AppointmentService {
     private repository: AppointmentRepository;

     constructor() {
          this.repository = new AppointmentRepository();
     }

     async listAppointments() {
          return await this.repository.getAll();
     }

     async getAppointment(id: number) {
          return await this.repository.getById(id);
     }

     async registerPatient(data: {
          patientId: number;
          doctorId: number;
          polyclinicId?: number;
          appointmentDate: Date;
          notes?: string;
          source?: string;
     }) {
          const appointmentCode = `REG-${Date.now().toString().slice(-6)}`;
          
          return await this.repository.create({
               appointmentCode,
               patient: { connect: { id: data.patientId } },
               doctor: { connect: { id: data.doctorId } },
               ...(data.polyclinicId && { polyclinic: { connect: { id: data.polyclinicId } } }),
               appointmentDate: data.appointmentDate,
               appointmentTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
               status: "Terkonfirmasi",
               notes: data.notes,
               source: data.source || "Manual"
          });
     }

     async updateStatus(id: number, status: string) {
          return await this.repository.update(id, { status });
     }

     async cancelAppointment(id: number) {
          return await this.repository.delete(id);
     }
}
