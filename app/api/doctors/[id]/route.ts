import { NextResponse } from "next/server";
import * as doctorService from "@/lib/services/doctorService";

export async function DELETE(
     request: Request,
     { params }: { params: Promise<{ id: string }> }
) {
     try {
          const { id } = await params;
          await doctorService.deleteDoctor(id);
          return NextResponse.json({ message: "Doctor deleted" });
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
          const doctor = await doctorService.updateDoctor(id, data);
          return NextResponse.json(doctor);
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 400 });
     }
}
