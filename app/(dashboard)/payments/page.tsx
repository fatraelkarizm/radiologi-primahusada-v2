"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PaymentsPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">Kasir / Pembayaran</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Antrian pembayaran dan riwayat transaksi.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
