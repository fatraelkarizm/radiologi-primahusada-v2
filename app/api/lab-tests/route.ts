import { NextResponse } from "next/server";
import * as labTestService from "@/lib/services/labTestService";

export async function GET() {
    try {
        const tests = await labTestService.getLabTests();
        return NextResponse.json(tests);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const test = await labTestService.createLabTest(data);
        return NextResponse.json(test);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
