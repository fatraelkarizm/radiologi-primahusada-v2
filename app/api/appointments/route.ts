import { NextResponse } from "next/server";
import { AppointmentService } from "@/lib/services/appointmentService";

const appointmentService = new AppointmentService();

export async function GET() {
     try {
          const appointments = await appointmentService.listAppointments();
          return NextResponse.json(appointments);
     } catch (error) {
          console.error("GET /api/appointments error:", error);
          return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
     }
}

export async function POST(request: Request) {
     try {
          const body = await request.json();
          const { patientId, doctorId, polyclinicId, appointmentDate, notes, source } = body;

          if (!patientId || !doctorId || !appointmentDate) {
               return NextResponse.json({ error: "Patient ID, Doctor ID, and Date are required" }, { status: 400 });
          }

          const appointment = await appointmentService.registerPatient({
               patientId: Number(patientId),
               doctorId: Number(doctorId),
               polyclinicId: polyclinicId ? Number(polyclinicId) : undefined,
               appointmentDate: new Date(appointmentDate),
               notes,
               source
          });

          return NextResponse.json(appointment);
     } catch (error: any) {
          console.error("POST /api/appointments error:", error);
          return NextResponse.json({ error: error.message || "Failed to create appointment" }, { status: 500 });
     }
}
