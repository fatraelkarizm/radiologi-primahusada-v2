"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsRevenuePage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">Laporan Pendapatan</h1>
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                         <CardHeader><CardTitle>Pendapatan Harian</CardTitle></CardHeader>
                         <CardContent><p className="text-2xl font-bold">Rp 0</p></CardContent>
                    </Card>
                    <Card>
                         <CardHeader><CardTitle>Pendapatan Bulanan</CardTitle></CardHeader>
                         <CardContent><p className="text-2xl font-bold">Rp 0</p></CardContent>
                    </Card>
               </div>
          </div>
     );
}
