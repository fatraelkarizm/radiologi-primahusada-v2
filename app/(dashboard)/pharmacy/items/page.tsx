"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function PharmacyItemsPage() {
     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Data Barang (Obat)</h1>
                    <Button><Plus className="w-4 h-4 mr-2" /> Tambah Barang</Button>
               </div>
               <Card>
                    <CardContent className="pt-6">
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Kode Barang</TableHead>
                                        <TableHead>Nama Barang</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Stok</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead>Aksi</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Data barang kosong</TableCell></TableRow>
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}
