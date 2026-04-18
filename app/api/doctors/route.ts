import { NextResponse } from "next/server";
import * as doctorService from "@/lib/services/doctorService";

export async function GET() {
    try {
        const doctors = await doctorService.getDoctors();
        return NextResponse.json(doctors);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const doctor = await doctorService.createDoctor(data);
        return NextResponse.json(doctor);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
