"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PCareSubSpecialistPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">PCare BPJS: Sub Spesialis</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Referensi dokter sub-spesialis.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
