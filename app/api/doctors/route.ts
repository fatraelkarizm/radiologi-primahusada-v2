import { NextResponse } from "next/server";
import { mockDoctors } from "@/lib/mock-data";

export async function GET() {
     return NextResponse.json(mockDoctors);
}

export async function POST(request: Request) {
     const data = await request.json();
     // Mock response - for demo only
     return NextResponse.json({ ...data, id: mockDoctors.length + 1 });
}
