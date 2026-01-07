"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PharmacyInPage() {
     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Barang Masuk</h1>
                    <Button><Plus className="w-4 h-4 mr-2" /> Input Barang Masuk</Button>
               </div>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Belum ada riwayat barang masuk.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
