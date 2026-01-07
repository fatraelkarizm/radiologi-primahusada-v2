"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PharmacySalesPage() {
     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Penjualan Umum (Bebas)</h1>
                    <Button><Plus className="w-4 h-4 mr-2" /> Transaksi Baru</Button>
               </div>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Belum ada transaksi penjualan hari ini.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
