"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Printer, Edit, Trash2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { PrintLabLayout } from "@/components/PrintLabLayout";

export default function LabTestsPage() {
     const { data: session, status } = useSession();
     const [labTests, setLabTests] = useState<any[]>([]);
     const [patients, setPatients] = useState<any[]>([]);
     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [labTestToPrint, setLabTestToPrint] = useState<any | null>(null);
     const printRef = useRef<HTMLDivElement>(null);
     const [formData, setFormData] = useState({
          patientId: "",
          category: "",
          testType: "",
          priority: "Normal",
          status: "Menunggu Sample"
     });

     const handlePrint = useReactToPrint({
          contentRef: printRef,
          onAfterPrint: () => setLabTestToPrint(null)
     });

     useEffect(() => {
          if (labTestToPrint) handlePrint();
     }, [labTestToPrint]);

     useEffect(() => {
          if (status === 'authenticated') {
               fetch('/api/lab-tests').then(res => res.json()).then(setLabTests);
               fetch('/api/patients').then(res => res.json()).then(setPatients);
          }
     }, [status]);

     const handleSubmit = async () => {
          const res = await fetch('/api/lab-tests', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(formData)
          });
          if (res.ok) {
               setIsAddModalOpen(false);
               const data = await fetch('/api/lab-tests').then(r => r.json());
               setLabTests(data);
          }
     };

     const getStatusColor = (status: string) => {
          switch (status) {
               case "Selesai": return "bg-green-100 text-green-800";
               case "Dalam Proses": return "bg-yellow-100 text-yellow-800";
               default: return "bg-blue-100 text-blue-800";
          }
     };

     return (
          <div className="space-y-6">
               <div style={{ display: "none" }}>
                    {labTestToPrint && (
                         <PrintLabLayout
                              ref={printRef}
                              labTest={labTestToPrint}
                         />
                    )}
               </div>

               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold">Laboratorium</h1>
                         <p className="text-muted-foreground">Kelola pemeriksaan lab.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Tambah Tes</Button>
               </div>

               <Card>
                    <CardContent className="pt-6">
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Pasien</TableHead>
                                        <TableHead>Jenis Tes</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {labTests.map(test => (
                                        <TableRow key={test.id}>
                                             <TableCell>LAB-{test.id}</TableCell>
                                             <TableCell>{test.patientName || test.patients?.name}</TableCell>
                                             <TableCell>{test.testType}</TableCell>
                                             <TableCell><Badge variant="outline" className={getStatusColor(test.status)}>{test.status}</Badge></TableCell>
                                             <TableCell className="text-right">
                                                  <Button size="sm" variant="ghost" onClick={() => setLabTestToPrint(test)}><Printer className="w-4 h-4" /></Button>
                                             </TableCell>
                                        </TableRow>
                                   ))}
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
                                        <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                        <SelectContent>
                                             {patients.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="grid gap-2">
                                   <Label>Kategori</Label>
                                   <Select onValueChange={v => setFormData({ ...formData, category: v })}>
                                        <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Hematologi">Hematologi</SelectItem>
                                             <SelectItem value="Kimia Darah">Kimia Darah</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="grid gap-2">
                                   <Label>Jenis Tes</Label>
                                   <Input onChange={e => setFormData({ ...formData, testType: e.target.value })} placeholder="Cth: Darah Lengkap" />
                              </div>
                              <Button onClick={handleSubmit}>Simpan</Button>
                         </div>
                    </DialogContent>
               </Dialog>
          </div>
     );
}
