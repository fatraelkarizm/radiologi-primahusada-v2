import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     try {
          const patients = await prisma.patient.findMany({
               include: { doctor: true },
               orderBy: { createdAt: "desc" },
          });
          return NextResponse.json(patients);
     } catch (error) {
          return NextResponse.json({ message: "Error fetching patients" }, { status: 500 });
     }
}

export async function POST(request: Request) {
     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     try {
          const formData = await request.formData();

          // Helper to safely get string/number
          const getString = (key: string) => formData.get(key) as string || "";
          const getNumber = (key: string) => Number(formData.get(key)) || 0;
          const getNumberOrNull = (key: string) => formData.get(key) ? Number(formData.get(key)) : null;

          const newPatient = await prisma.patient.create({
               data: {
                    name: getString("name"),
                    age: getNumber("age"),
                    gender: getString("gender"),
                    phone: getString("phone"),
                    address: getString("address"),
                    status: getString("status") || "Aktif",
                    examination: getString("examination"),
                    clinic: getString("clinic"),
                    review: getString("review"),
                    doctor_id: getNumberOrNull("doctor_id"),
                    // photo_url: handled via separate upload logic or skipped for now
               },
          });

          return NextResponse.json(newPatient);
     } catch (error) {
          console.error("Error creating patient:", error);
          return NextResponse.json({ message: "Error creating patient" }, { status: 500 });
     }
}
