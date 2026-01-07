import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
     request: Request,
     { params }: { params: { id: string } }
) {
     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     const { id } = await Promise.resolve(params);

     try {
          const doctorId = parseInt(id);
          await prisma.doctor.delete({
               where: { id: doctorId },
          });
          return NextResponse.json({ message: "Doctor deleted" });
     } catch (error) {
          return NextResponse.json({ message: "Error deleting doctor" }, { status: 500 });
     }
}

export async function PUT(
     request: Request,
     { params }: { params: { id: string } }
) {
     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     const { id } = await Promise.resolve(params);

     try {
          const data = await request.json();
          const doctorId = parseInt(id);

          const updatedDoctor = await prisma.doctor.update({
               where: { id: doctorId },
               data: {
                    name: data.name,
                    specialization: data.specialization,
                    license_number: data.license_number,
                    phone: data.phone,
                    email: data.email,
                    experience: Number(data.experience),
                    status: data.status,
               },
          });

          return NextResponse.json(updatedDoctor);
     } catch (error) {
          return NextResponse.json({ message: "Error updating doctor" }, { status: 500 });
     }
}
