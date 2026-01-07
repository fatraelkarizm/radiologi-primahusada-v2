"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

const insurances = [
     { id: 1, name: "BPJS Kesehatan", type: "National", status: "Aktif" },
     { id: 2, name: "Admedika", type: "Private", status: "Aktif" },
     { id: 3, name: "Prudential", type: "Private", status: "Aktif" },
     { id: 4, name: "Allianz", type: "Private", status: "Aktif" },
     { id: 5, name: "InHealth", type: "Private", status: "Non-Aktif" },
];

export default function InsuranceSettingsPage() {
     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                         <h3 className="text-lg font-medium">Asuransi & Jaminan</h3>
                         <p className="text-sm text-muted-foreground">
                              Kelola daftar asuransi yang bekerjasama dengan klinik.
                         </p>
                    </div>
                    <Button className="bg-[#125eab] hover:bg-blue-700">
                         <Plus className="w-4 h-4 mr-2" />
                         Tambah Asuransi
                    </Button>
               </div>

               <Card>
                    <CardHeader className="pb-3">
                         <div className="flex items-center justify-between">
                              <CardTitle>Daftar Asuransi</CardTitle>
                              <div className="relative w-64">
                                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                   <Input placeholder="Cari asuransi..." className="pl-9" />
                              </div>
                         </div>
                    </CardHeader>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Nama Asuransi</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {insurances.map((item) => (
                                        <TableRow key={item.id}>
                                             <TableCell className="font-medium">{item.name}</TableCell>
                                             <TableCell>{item.type}</TableCell>
                                             <TableCell>
                                                  <Badge variant={item.status === "Aktif" ? "default" : "secondary"} className={item.status === "Aktif" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                                                       {item.status}
                                                  </Badge>
                                             </TableCell>
                                             <TableCell className="text-right">
                                                  <div className="flex justify-end gap-2">
                                                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                                                            <Edit className="h-4 w-4" />
                                                       </Button>
                                                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600">
                                                            <Trash2 className="h-4 w-4" />
                                                       </Button>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}
