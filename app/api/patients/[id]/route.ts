import { NextResponse } from "next/server";
import * as patientService from "@/lib/services/patientService";

export async function DELETE(
     request: Request,
     { params }: { params: Promise<{ id: string }> }
) {
     try {
          const { id } = await params;
          await patientService.deletePatient(id);
          return NextResponse.json({ message: "Patient deleted" });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}

export async function PUT(
     request: Request,
     { params }: { params: Promise<{ id: string }> }
) {
     try {
          const { id } = await params;
          const data = await request.json();
          const patient = await patientService.updatePatient(id, data);
          return NextResponse.json(patient);
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 400 });
     }
}
