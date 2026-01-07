"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, User } from "lucide-react";

const polyclinics = [
     { id: 1, name: "Poli Umum", doctorCount: 3, status: "Buka", time: "08:00 - 20:00" },
     { id: 2, name: "Poli Gigi", doctorCount: 2, status: "Buka", time: "09:00 - 21:00" },
     { id: 3, name: "Poli KIA", doctorCount: 2, status: "Buka", time: "08:00 - 16:00" },
     { id: 4, name: "Poli Kulit & Kelamin", doctorCount: 1, status: "Tutup", time: "16:00 - 20:00" },
];

export default function PolyclinicsSettingsPage() {
     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                         <h3 className="text-lg font-medium">Poliklinik</h3>
                         <p className="text-sm text-muted-foreground">
                              Manajemen unit pelayanan atau poliklinik.
                         </p>
                    </div>
                    <Button className="bg-[#125eab] hover:bg-blue-700">
                         <Plus className="w-4 h-4 mr-2" />
                         Tambah Poli
                    </Button>
               </div>

               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {polyclinics.map((poli) => (
                         <Card key={poli.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                   <CardTitle className="text-base font-bold text-[#125eab] flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        {poli.name}
                                   </CardTitle>
                                   <Badge variant={poli.status === "Buka" ? "default" : "secondary"} className={poli.status === "Buka" ? "bg-green-500" : ""}>
                                        {poli.status}
                                   </Badge>
                              </CardHeader>
                              <CardContent>
                                   <div className="text-sm text-slate-500 mt-2 space-y-1">
                                        <div className="flex justify-between">
                                             <span>Jam Operasional:</span>
                                             <span className="font-medium text-slate-700">{poli.time}</span>
                                        </div>
                                        <div className="flex justify-between">
                                             <span>Jumlah Dokter:</span>
                                             <span className="font-medium text-slate-700 flex items-center gap-1">
                                                  <User className="w-3 h-3" /> {poli.doctorCount}
                                             </span>
                                        </div>
                                   </div>
                                   <div className="mt-4 flex gap-2">
                                        <Button variant="outline" size="sm" className="w-full">Edit</Button>
                                        <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700">Tutup</Button>
                                   </div>
                              </CardContent>
                         </Card>
                    ))}
               </div>
          </div>
     );
}
