"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ReportsStockRecapPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">Rekapitulasi Buku Stok</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Laporan pergerakan stok farmasi.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
