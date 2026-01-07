import { NextResponse } from "next/server";

export async function PUT(
     request: Request,
     { params }: { params: { id: string } }
) {
     const data = await request.json();
     // Mock response - for demo only
     return NextResponse.json({ ...data, id: params.id });
}

export async function DELETE(
     request: Request,
     { params }: { params: { id: string } }
) {
     // Mock response - for demo only
     return NextResponse.json({ message: "Lab test deleted" });
}
