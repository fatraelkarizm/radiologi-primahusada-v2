import { NextResponse } from "next/server";
import { mockLabTests } from "@/lib/mock-data";

export async function GET() {
     return NextResponse.json(mockLabTests);
}

export async function POST(request: Request) {
     const data = await request.json();
     // Mock response - for demo only
     return NextResponse.json({ ...data, id: mockLabTests.length + 1 });
}
