"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PharmacyQueuePage() {
     return (
          <div className="space-y-6">
               <h1 className="text-3xl font-bold">Antrian Farmasi</h1>
               <Card>
                    <CardContent className="pt-6">
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>No. Antrian</TableHead>
                                        <TableHead>Nama Pasien</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Waktu Masuk</TableHead>
                                        <TableHead>Aksi</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Tidak ada antrian</TableCell></TableRow>
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}
