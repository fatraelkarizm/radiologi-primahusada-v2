import { NextResponse } from "next/server";
import { mockPatients } from "@/lib/mock-data";

export async function GET() {
     return NextResponse.json(mockPatients);
}

export async function POST(request: Request) {
     const data = await request.json();
     // Mock response - for demo only
     return NextResponse.json({ ...data, id: mockPatients.length + 1 });
}
