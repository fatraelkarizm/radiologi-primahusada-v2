import { NextResponse } from "next/server";

export async function GET() {
     // Mock X-Ray data for demo
     const mockXRayExams = [
          {
               id: 1,
               patient_id: 1,
               examination_type: "Rontgen Dada",
               body_part: "Thorax",
               status: "Selesai",
               priority: "Normal",
               findings: "Gambaran jantung dan paru dalam batas normal",
               createdAt: new Date(),
               patient: { id: 1, name: "Budi Setiawan" },
               doctor: { id: 1, name: "dr. Rizki Ramadhan, Sp.Rad" },
          },
     ];

     return NextResponse.json(mockXRayExams);
}

export async function POST(request: Request) {
     const data = await request.json();
     // Mock response - for demo only
     return NextResponse.json({ ...data, id: 1 });
}
