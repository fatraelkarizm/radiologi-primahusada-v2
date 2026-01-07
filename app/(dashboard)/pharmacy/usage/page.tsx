"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PharmacyUsagePage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">Laporan Pemakaian Barang</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Grafik pemakaian obat per periode.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
