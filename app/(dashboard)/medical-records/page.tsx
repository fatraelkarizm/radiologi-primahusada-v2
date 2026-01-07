"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MedicalRecordsPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">Rekam Medis</h1>

               <Card>
                    <CardContent className="pt-6">
                         <div className="flex items-center gap-4 mb-6">
                              <div className="relative flex-1">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                   <Input placeholder="Cari rekam medis..." className="pl-10" />
                              </div>
                         </div>

                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Pasien</TableHead>
                                        <TableHead>Dokter</TableHead>
                                        <TableHead>Diagnosa</TableHead>
                                        <TableHead>Tindakan</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                             Belum ada rekam medis.
                                        </TableCell>
                                   </TableRow>
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}
