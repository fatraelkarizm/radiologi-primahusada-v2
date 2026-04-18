import { NextResponse } from "next/server";
import * as patientService from "@/lib/services/patientService";

export async function GET() {
    try {
        const patients = await patientService.getPatients();
        return NextResponse.json(patients);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const patient = await patientService.createPatient(data);
        return NextResponse.json(patient);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
