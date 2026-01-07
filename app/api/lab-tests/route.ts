import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     try {
          const labTests = await prisma.labTest.findMany({
               include: {
                    patient: true,
                    doctor: true,
               },
               orderBy: { createdAt: "desc" },
          });

          // Transform data to match frontend expectations if necessary
          const formattedTests = labTests.map((test: { patient: { name: string; }; doctor: { name: string; }; testType: string; }) => ({
               ...test,
               patientName: test.patient.name,
               doctorName: test.doctor?.name,
               testType: test.testType, 
          }));

          return NextResponse.json(formattedTests);
     } catch (error) {
          console.error("Error fetching lab tests:", error);
          return NextResponse.json({ message: "Error fetching lab tests" }, { status: 500 });
     }
}

export async function POST(request: Request) {
     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     try {
          const data = await request.json();

          // Validate required fields
          if (!data.patientId || !data.category || !data.testType) {
               return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
          }

          const newTest = await prisma.labTest.create({
               data: {
                    patient_id: parseInt(data.patientId),
                    category: data.category,
                    testType: data.testType,
                    doctor_id: data.doctorId ? parseInt(data.doctorId) : null,
                    date: data.date ? new Date(data.date) : new Date(),
                    status: data.status || "Menunggu Sample",
                    priority: data.priority || "Normal",
                    notes: data.notes,
                    results: data.results || {},
               },
               include: {
                    patient: true,
                    doctor: true
               }
          });

          return NextResponse.json(newTest);
     } catch (error) {
          console.error("Error creating lab test:", error);
          return NextResponse.json({ message: "Error creating lab test" }, { status: 500 });
     }
}
