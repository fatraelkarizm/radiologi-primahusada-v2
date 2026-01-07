import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
     request: Request,
     { params }: { params: { id: string } } // params need to be awaited in newer Next.js or typed correctly
) {
     // In Next.js 15+, params is a Promise. But usually { params } works if typed correctly or awaited.
     // Wait, in Next 15 `params` is a Promise.

     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     const { id } = await Promise.resolve(params); // Handle promise if needed or standard object
     // Actually params is standard object in non-dynamic I/O, but let's be safe.
     // Wait, Next 15 *does* require `await params`.

     try {
          const patientId = parseInt(id);
          await prisma.patient.delete({
               where: { id: patientId },
          });
          return NextResponse.json({ message: "Patient deleted" });
     } catch (error) {
          return NextResponse.json({ message: "Error deleting patient" }, { status: 500 });
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
          const patientId = parseInt(id);

          const updatedPatient = await prisma.patient.update({
               where: { id: patientId },
               data: {
                    name: data.name,
                    age: Number(data.age),
                    gender: data.gender,
                    phone: data.phone,
                    address: data.address,
                    status: data.status,
                    examination: data.examination,
                    clinic: data.clinic,
                    review: data.review,
                    doctor_id: data.doctor_id ? Number(data.doctor_id) : null,
               },
          });

          return NextResponse.json(updatedPatient);
     } catch (error) {
          console.error("Error updating patient:", error);
          return NextResponse.json({ message: "Error updating patient" }, { status: 500 });
     }
}
