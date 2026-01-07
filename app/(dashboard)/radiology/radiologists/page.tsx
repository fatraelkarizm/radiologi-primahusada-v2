"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
     Card,
     CardContent,
     CardHeader,
     CardTitle,
     CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Edit } from "lucide-react";

export default function RadiologistsPage() {
     const { data: session, status } = useSession();
     const [isAuthenticated, setIsAuthenticated] = useState(false);

     const [doctors, setDoctors] = useState<any[]>([]);
     const [searchTerm, setSearchTerm] = useState("");
     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [formData, setFormData] = useState({
          name: "",
          phone: "",
          specialization: "Radiologi", // Default
          email: "",
          experience: "0",
          license_number: "",
     });

     useEffect(() => {
          if (status === 'authenticated') setIsAuthenticated(true);
     }, [status]);

     const fetchDoctors = async () => {
          try {
               const res = await fetch("/api/doctors");
               if (res.ok) {
                    const data = await res.json();
                    // Filter only Radiologists implicitly or explicitly
                    // Since the user asked for "Radiologs", we can filter by specialization if we want
                    // but for now I'll show all doctors but highlight they are managed here? 
                    // Better: Client side filter for "Radiologi"
                    const radiologs = data.filter((d: any) => d.specialization === 'Radiologi');
                    setDoctors(radiologs);
               }
          } catch (e) { console.error(e); }
     };

     useEffect(() => {
          if (isAuthenticated) fetchDoctors();
     }, [isAuthenticated]);

     const handleSubmit = async () => {
          try {
               const res = await fetch("/api/doctors", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
               });
               if (res.ok) {
                    setIsAddModalOpen(false);
                    fetchDoctors();
                    setFormData({ name: "", phone: "", specialization: "Radiologi", email: "", experience: "0", license_number: "" });
               } else {
                    alert("Gagal menyimpan");
               }
          } catch (e) { console.error(e); }
     }

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold">Manajemen Radiolog</h1>
                         <p className="text-muted-foreground">Daftar dokter spesialis Radiologi.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Tambah Radiolog</Button>
               </div>

               <Card>
                    <CardContent className="pt-6">
                         <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input placeholder="Cari radiolog..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                         </div>
                    </CardContent>
               </Card>

               <Card>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Spesialisasi</TableHead>
                                        <TableHead>No. SIP</TableHead>
                                        <TableHead>Telepon</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map((doc) => (
                                        <TableRow key={doc.id}>
                                             <TableCell className="font-medium">{doc.name}</TableCell>
                                             <TableCell>{doc.specialization}</TableCell>
                                             <TableCell>{doc.license_number || "-"}</TableCell>
                                             <TableCell>{doc.phone}</TableCell>
                                             <TableCell className="text-right">
                                                  <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                             </TableCell>
                                        </TableRow>
                                   ))}
                                   {doctors.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-4">Belum ada data Radiolog</TableCell></TableRow>}
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>

               <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Tambah Radiolog</DialogTitle>
                         </DialogHeader>
                         <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                   <Label>Nama Lengkap</Label>
                                   <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="dr. Fulan" />
                              </div>
                              <div className="grid gap-2">
                                   <Label>Spesialisasi</Label>
                                   <Input value={formData.specialization} readOnly className="bg-slate-50" />
                              </div>
                              <div className="grid gap-2">
                                   <Label>Nomor SIP</Label>
                                   <Input value={formData.license_number} onChange={e => setFormData({ ...formData, license_number: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                   <Label>No. Telepon</Label>
                                   <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                              </div>
                              <Button onClick={handleSubmit}>Simpan</Button>
                         </div>
                    </DialogContent>
               </Dialog>
          </div>
     );
}
