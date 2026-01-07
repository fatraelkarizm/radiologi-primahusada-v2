import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     try {
          const exams = await prisma.xrayExam.findMany({
               include: {
                    patient: true,
                    doctor: true,
               },
               orderBy: { createdAt: "desc" },
          });

          // Dashboard expects specific format sometimes, but standard is usually fine
          return NextResponse.json(exams);
     } catch (error) {
          return NextResponse.json({ message: "Error fetching xray exams" }, { status: 500 });
     }
}

export async function POST(request: Request) {
     const session = await auth();
     if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

     try {
          const data = await request.json();
          const newExam = await prisma.xrayExam.create({
               data: {
                    patient_id: parseInt(data.patientId),
                    examination_type: data.examinationType,
                    body_part: data.bodyPart,
                    doctor_id: data.doctorId ? parseInt(data.doctorId) : null,
                    status: data.status || "Menunggu",
                    priority: data.priority || "Normal",
                    findings: data.findings,
                    impression: data.impression
               }
          });
          return NextResponse.json(newExam);
     } catch (error) {
          return NextResponse.json({ message: "Error creating xray exam" }, { status: 500 });
     }
}
