"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ReportsDiseaseIndexPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">Rekap Index Penyakit</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Indeks penyakit pasien rawat jalan.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
