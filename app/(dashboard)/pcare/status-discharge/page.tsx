"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PCareStatusDischargePage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">PCare BPJS: Status Pulang</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Referensi status pulang pasien.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
