"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal } from "lucide-react";

const services = [
     { id: 1, code: "UM001", name: "Konsultasi Dokter Umum", category: "Umum", price: 50000 },
     { id: 2, code: "GIG001", name: "Konsultasi Dokter Gigi", category: "Gigi", price: 75000 },
     { id: 3, code: "TND001", name: "Jahit Luka (1-3)", category: "Tindakan", price: 150000 },
     { id: 4, code: "TND002", name: "Nebulizer", category: "Tindakan", price: 65000 },
     { id: 5, code: "ADMIN", name: "Administrasi Pasien Baru", category: "Admin", price: 15000 },
];

export default function ServicesSettingsPage() {
     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                         <h3 className="text-lg font-medium">Layanan & Tindakan</h3>
                         <p className="text-sm text-muted-foreground">
                              Atur harga dan daftar layanan medis.
                         </p>
                    </div>
                    <Button className="bg-[#125eab] hover:bg-blue-700">
                         <Plus className="w-4 h-4 mr-2" />
                         Tambah Layanan
                    </Button>
               </div>

               <Card>
                    <CardHeader className="pb-3">
                         <div className="flex items-center justify-between">
                              <CardTitle>Daftar Layanan</CardTitle>
                              <div className="relative w-64">
                                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                   <Input placeholder="Cari layanan..." className="pl-9" />
                              </div>
                         </div>
                    </CardHeader>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Layanan</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="text-right">Harga</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {services.map((service) => (
                                        <TableRow key={service.id}>
                                             <TableCell className="font-mono text-xs text-slate-500">{service.code}</TableCell>
                                             <TableCell className="font-medium">{service.name}</TableCell>
                                             <TableCell>
                                                  <Badge variant="outline">{service.category}</Badge>
                                             </TableCell>
                                             <TableCell className="text-right font-medium">
                                                  Rp {service.price.toLocaleString('id-ID')}
                                             </TableCell>
                                             <TableCell>
                                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                                       <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                  </Button>
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
