import { prisma } from "@/lib/prisma";
import { Appointment, Prisma } from "@prisma/client";

export class AppointmentRepository {
     async getAll(): Promise<Appointment[]> {
          return await prisma.appointment.findMany({
               include: {
                    patient: true,
                    doctor: true,
                    polyclinic: true,
               },
               orderBy: { appointmentDate: 'desc' }
          });
     }

     async getById(id: number): Promise<Appointment | null> {
          return await prisma.appointment.findUnique({
               where: { id },
               include: {
                    patient: true,
                    doctor: true,
                    polyclinic: true,
               }
          });
     }

     async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
          return await prisma.appointment.create({ data });
     }

     async update(id: number, data: Prisma.AppointmentUpdateInput): Promise<Appointment> {
          return await prisma.appointment.update({
               where: { id },
               data,
          });
     }

     async delete(id: number): Promise<Appointment> {
          return await prisma.appointment.delete({
               where: { id },
          });
     }
}
