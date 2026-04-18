import { NextResponse } from "next/server";
import * as dashboardService from "@/lib/services/dashboardService";

export async function GET() {
    try {
        const stats = await dashboardService.getStats();
        return NextResponse.json(stats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
