"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PCareSpecialPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">PCare BPJS: Khusus</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Data khusus (prosedur/obat tertentu).</p>
                    </CardContent>
               </Card>
          </div>
     );
}
