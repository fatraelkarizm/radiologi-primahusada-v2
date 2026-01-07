"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

export default function PatientsPage() {
     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Pasien</h1>
                    <Button>
                         <Plus className="w-4 h-4 mr-2" /> Tambah Pasien
                    </Button>
               </div>

               <Card>
                    <CardContent className="pt-6">
                         <div className="flex items-center gap-4 mb-6">
                              <div className="relative flex-1">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                   <Input placeholder="Cari nama pasien atau ID..." className="pl-10" />
                              </div>
                         </div>

                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>No. RM</TableHead>
                                        <TableHead>Nama Pasien</TableHead>
                                        <TableHead>Usia</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>No. Telepon</TableHead>
                                        <TableHead>Aksi</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                             Belum ada data pasien.
                                        </TableCell>
                                   </TableRow>
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}
