"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function PharmacyPricesPage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">Harga Jual Obat</h1>
               <Card>
                    <CardContent className="pt-6">
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Nama Obat</TableHead>
                                        <TableHead>Harga Beli</TableHead>
                                        <TableHead>Margin (%)</TableHead>
                                        <TableHead>Harga Jual</TableHead>
                                        <TableHead>Aksi</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Data kosong</TableCell></TableRow>
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}
