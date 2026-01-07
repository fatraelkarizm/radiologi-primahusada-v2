import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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
          const testId = parseInt(id);

          const updatedTest = await prisma.labTest.update({
               where: { id: testId },
               data: {
                    status: data.status,
                    results: data.results,
                    notes: data.notes,
                    // Allow updating other fields if needed
               },
               include: {
                    patient: true,
                    doctor: true
               }
          });

          return NextResponse.json(updatedTest);
     } catch (error) {
          console.error("Error updating lab test:", error);
          return NextResponse.json({ message: "Error updating lab test" }, { status: 500 });
     }
}

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
          const testId = parseInt(id);
          await prisma.labTest.delete({
               where: { id: testId },
          });

          return NextResponse.json({ message: "Lab test deleted" });
     } catch (error) {
          return NextResponse.json({ message: "Error deleting lab test" }, { status: 500 });
     }
}
