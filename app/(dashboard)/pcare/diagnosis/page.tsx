"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PCareDiagnosisPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">PCare BPJS: Diagnosa</h1>
               <Card>
                    <CardContent className="pt-6">
                         <p className="text-muted-foreground text-center">Mapping diagnosa ICD-10 dengan PCare.</p>
                    </CardContent>
               </Card>
          </div>
     );
}
