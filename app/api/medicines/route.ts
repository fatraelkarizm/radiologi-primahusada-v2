import { NextResponse } from "next/server";
import { MedicineService } from "@/lib/services/medicineService";

const medicineService = new MedicineService();

export async function GET() {
     try {
          const medicines = await medicineService.listMedicines();
          return NextResponse.json(medicines);
     } catch (error) {
          console.error("GET /api/medicines error:", error);
          return NextResponse.json({ error: "Failed to fetch medicines" }, { status: 500 });
     }
}

export async function POST(request: Request) {
     try {
          const body = await request.json();
          const medicine = await medicineService.addMedicine(body);
          return NextResponse.json(medicine);
     } catch (error: any) {
          console.error("POST /api/medicines error:", error);
          return NextResponse.json({ error: error.message || "Failed to create medicine" }, { status: 500 });
     }
}
