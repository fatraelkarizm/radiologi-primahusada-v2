import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     try {
          const doctors = await prisma.doctor.findMany({
               orderBy: { name: "asc" },
          });
          return NextResponse.json(doctors);
     } catch (error) {
          return NextResponse.json({ message: "Error fetching doctors" }, { status: 500 });
     }
}

export async function POST(request: Request) {
     const session = await auth();
     if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     try {
          const data = await request.json();
          const newDoctor = await prisma.doctor.create({
               data: {
                    name: data.name,
                    specialization: data.specialization,
                    license_number: data.license_number,
                    phone: data.phone,
                    email: data.email,
                    experience: Number(data.experience),
                    status: data.status || "Aktif",
               },
          });

          return NextResponse.json(newDoctor);
     } catch (error) {
          console.error("Error creating doctor:", error);
          return NextResponse.json({ message: "Error creating doctor" }, { status: 500 });
     }
}
