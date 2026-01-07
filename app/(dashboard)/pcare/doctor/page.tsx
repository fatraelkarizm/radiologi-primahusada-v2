"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PCareDoctorPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">PCare BPJS: Dokter</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Mapping data dokter dengan PCare.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
