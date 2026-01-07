"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PharmacyDisposalPage() {
     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Pemusnahan Barang (Expired/Rusak)</h1>
                    <Button variant="destructive">Input Pemusnahan</Button>
               </div>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Belum ada data pemusnahan barang.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
