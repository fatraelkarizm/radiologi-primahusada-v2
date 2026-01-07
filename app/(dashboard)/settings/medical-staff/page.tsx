"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";

const staff = [
     { id: 1, name: "dr. Andi Wijaya", role: "Dokter Umum", sip: "123.456.789", status: "Aktif" },
     { id: 2, name: "dr. Budi Santoso", role: "Dokter Gigi", sip: "987.654.321", status: "Aktif" },
     { id: 3, name: "Siti Aminah, Amd.Kep", role: "Perawat", sip: "STR-2024-001", status: "Aktif" },
     { id: 4, name: "Rina Sari, S.Farm", role: "Apoteker", sip: "STR-2024-002", status: "Cuti" },
     { id: 5, name: "Joko Susilo", role: "Admin", sip: "-", status: "Aktif" },
];

export default function MedicalStaffSettingsPage() {
     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                         <h3 className="text-lg font-medium">Tenaga Medis & Staff</h3>
                         <p className="text-sm text-muted-foreground">
                              Kelola data dokter, perawat, dan karyawan lainnya.
                         </p>
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline">
                              <Filter className="w-4 h-4 mr-2" />
                              Filter
                         </Button>
                         <Button className="bg-[#125eab] hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Tambah Staff
                         </Button>
                    </div>
               </div>

               <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                         <Input placeholder="Cari nama atau SIP..." className="pl-9" />
                    </div>
               </div>

               <div className="grid gap-4">
                    {staff.map((person) => (
                         <Card key={person.id} className="flex items-center p-4 justify-between hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-4">
                                   <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} />
                                        <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
                                   </Avatar>
                                   <div>
                                        <h4 className="font-medium text-sm">{person.name}</h4>
                                        <p className="text-xs text-muted-foreground">{person.role} • {person.sip !== '-' ? `SIP: ${person.sip}` : 'Non-Medis'}</p>
                                   </div>
                              </div>
                              <div className="flex items-center gap-4">
                                   <Badge variant={person.status === "Aktif" ? "outline" : "secondary"} className={person.status === "Aktif" ? "text-green-600 border-green-200 bg-green-50" : ""}>
                                        {person.status}
                                   </Badge>
                                   <Button variant="ghost" size="sm">Detail</Button>
                              </div>
                         </Card>
                    ))}
               </div>
          </div>
     );
}
