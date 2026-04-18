import { NextResponse } from "next/server";
import { MedicalRecordService } from "@/lib/services/medicalRecordService";

const medicalRecordService = new MedicalRecordService();

export async function GET() {
     try {
          const records = await medicalRecordService.listAllRecords();
          return NextResponse.json(records);
     } catch (error) {
          console.error("GET /api/medical-records error:", error);
          return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 });
     }
}

export async function POST(request: Request) {
     try {
          const body = await request.json();
          const { patientId, doctorId, chiefComplaint, diagnosis, icdCode, treatment, notes } = body;

          if (!patientId || !doctorId) {
               return NextResponse.json({ error: "Patient ID and Doctor ID are required" }, { status: 400 });
          }

          const record = await medicalRecordService.createNewRecord({
               patientId: Number(patientId),
               doctorId: Number(doctorId),
               chiefComplaint,
               diagnosis,
               icdCode,
               treatment,
               notes
          });

          return NextResponse.json(record);
     } catch (error: any) {
          console.error("POST /api/medical-records error:", error);
          return NextResponse.json({ error: error.message || "Failed to create medical record" }, { status: 500 });
     }
}
