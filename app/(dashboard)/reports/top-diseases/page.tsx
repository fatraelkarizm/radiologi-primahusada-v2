"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ReportsTopDiseasesPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">Laporan 10 Besar Penyakit</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Grafik dan tabel diagnosa terbanyak.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
