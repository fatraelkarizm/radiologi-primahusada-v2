import { NextResponse } from "next/server";
import * as xrayService from "@/lib/services/xrayService";

export async function GET() {
    try {
        const exams = await xrayService.getXRayExams();
        return NextResponse.json(exams);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get("content-type") || "";
        let data: any;

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Handle specific camelCase mapping from snake_case if sent by old frontend
            if (data.patient_id) data.patientId = data.patient_id;
            if (data.doctor_id) data.doctorId = data.doctor_id;
            if (data.examination_type) data.examinationType = data.examination_type;
            if (data.examination_date) data.examinationDate = data.examination_date;
        } else {
            data = await request.json();
        }

        const exam = await xrayService.createXRayExam(data);
        return NextResponse.json(exam);
    } catch (error: any) {
        console.error("POST /api/xray error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
