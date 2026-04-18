import { NextResponse } from "next/server";
import { PolyclinicService } from "@/lib/services/polyclinicService";

const polyclinicService = new PolyclinicService();

export async function GET() {
     try {
          const polyclinics = await polyclinicService.listPolyclinics();
          return NextResponse.json(polyclinics);
     } catch (error) {
          console.error("GET /api/polyclinics error:", error);
          return NextResponse.json({ error: "Failed to fetch polyclinics" }, { status: 500 });
     }
}
