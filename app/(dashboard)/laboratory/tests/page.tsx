"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Printer } from "lucide-react";
import { mockLabTests, mockPatients } from "@/lib/mock-data";

export default function LabTestsPage() {
     const [labTests] = useState(mockLabTests);
     const [patients] = useState(mockPatients);
     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [searchTerm, setSearchTerm] = useState("");
     const [formData, setFormData] = useState({
          patientId: "",
          category: "",
          testType: "",
          priority: "Normal",
          status: "Menunggu Sample"
     });

     const handleSubmit = () => {
          // Mock submit - untuk demo saja
          alert('Fitur ini akan aktif setelah integrasi database');
          setIsAddModalOpen(false);
     };

     const getStatusColor = (status: string) => {
          switch (status) {
               case "Selesai": return "bg-green-100 text-green-800";
               case "Dalam Proses": return "bg-yellow-100 text-yellow-800";
               default: return "bg-blue-100 text-blue-800";
          }
     };

     const filteredTests = labTests.filter(test =>
          test.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.testCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.testType?.toLowerCase().includes(searchTerm.toLowerCase())
     );

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold">Laboratorium</h1>
                         <p className="text-muted-foreground">Kelola pemeriksaan lab.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Tambah Tes</Button>
               </div>

               <Card>
                    <CardContent className="pt-6">
                         <div className="relative mb-4">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                   placeholder="Cari pemeriksaan lab..."
                                   className="pl-10"
                                   value={searchTerm}
                                   onChange={e => setSearchTerm(e.target.value)}
                              />
                         </div>

                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Pasien</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Jenis Tes</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {filteredTests.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                  Tidak ada data pemeriksaan
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        filteredTests.map(test => (
                                             <TableRow key={test.id}>
                                                  <TableCell className="font-medium">{test.testCode}</TableCell>
                                                  <TableCell>{test.patientName}</TableCell>
                                                  <TableCell>{test.category}</TableCell>
                                                  <TableCell>{test.testType}</TableCell>
                                                  <TableCell>{new Date(test.testDate).toLocaleDateString('id-ID')}</TableCell>
                                                  <TableCell>
                                                       <Badge variant="outline" className={getStatusColor(test.status)}>
                                                            {test.status}
                                                       </Badge>
                                                  </TableCell>
                                                  <TableCell className="text-right">
                                                       <Button size="sm" variant="ghost">
                                                            <Printer className="w-4 h-4" />
                                                       </Button>
                                                  </TableCell>
                                             </TableRow>
                                        ))
                                   )}
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>

               <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent>
                         <DialogHeader><DialogTitle>Tambah Tes Lab</DialogTitle></DialogHeader>
                         <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                   <Label>Pasien</Label>
                                   <Select onValueChange={v => setFormData({ ...formData, patientId: v })}>
                                        <SelectTrigger><SelectValue placeholder="Pilih pasien..." /></SelectTrigger>
                                        <SelectContent>
                                             {patients.map(p => (
                                                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="grid gap-2">
                                   <Label>Kategori</Label>
                                   <Select onValueChange={v => setFormData({ ...formData, category: v })}>
                                        <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Hematologi">Hematologi</SelectItem>
                                             <SelectItem value="Kimia Darah">Kimia Darah</SelectItem>
                                             <SelectItem value="Urinalisis">Urinalisis</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="grid gap-2">
                                   <Label>Jenis Tes</Label>
                                   <Input
                                        onChange={e => setFormData({ ...formData, testType: e.target.value })}
                                        placeholder="Contoh: Darah Lengkap"
                                   />
                              </div>
                              <Button onClick={handleSubmit}>Simpan</Button>
                         </div>
                    </DialogContent>
               </Dialog>
          </div>
     );
}
