"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PCarePolyPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">PCare BPJS: Poli</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Referensi Poliklinik PCare.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
