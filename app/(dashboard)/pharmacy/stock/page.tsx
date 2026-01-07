"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PharmacyStockOpnamePage() {
     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Stok Opname</h1>
                    <Button>Mulai Stok Opname</Button>
               </div>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Riwayat stok opname akan muncul di sini.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
