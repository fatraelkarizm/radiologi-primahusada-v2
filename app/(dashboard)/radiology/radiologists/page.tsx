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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Loader2, Edit } from "lucide-react";
import { Doctor } from "@prisma/client";

export default function RadiologistsPage() {
     const { status } = useSession();
     const isAuthenticated = status === 'authenticated';

     const [doctors, setDoctors] = useState<Doctor[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");
     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [submitting, setSubmitting] = useState(false);
     const [formData, setFormData] = useState({
          name: "",
          phone: "",
          specialization: "Radiologi",
          email: "",
          experience: "0",
          licenseNumber: "",
     });

     const fetchDoctors = async () => {
          setLoading(true);
          try {
               const res = await fetch("/api/doctors");
               if (res.ok) {
                    const data = await res.json();
                    // Filter only Radiologists
                    const radiologs = data.filter((d: any) => d.specialization === 'Radiologi');
                    setDoctors(radiologs);
               }
          } catch (e) { 
               console.error(e); 
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (isAuthenticated) fetchDoctors();
     }, [isAuthenticated]);

     const handleSubmit = async () => {
          if (!formData.name || !formData.licenseNumber) {
               alert("Nama dan SIP wajib diisi.");
               return;
          }

          setSubmitting(true);
          try {
               const res = await fetch("/api/doctors", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
               });
               if (res.ok) {
                    setIsAddModalOpen(false);
                    fetchDoctors();
                    setFormData({ name: "", phone: "", specialization: "Radiologi", email: "", experience: "0", licenseNumber: "" });
               } else {
                    const err = await res.json();
                    alert(`Gagal: ${err.error || "Terjadi kesalahan"}`);
               }
          } catch (e) { 
               console.error(e); 
          } finally {
               setSubmitting(false);
          }
     }

     if (status === "loading") return <div className="p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
     if (!isAuthenticated) return null;

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
                         <div className="rounded-md border mt-6">
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>Nama</TableHead>
                                             <TableHead>Spesialisasi</TableHead>
                                             <TableHead>No. SIP/STR</TableHead>
                                             <TableHead>Telepon</TableHead>
                                             <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {loading ? (
                                             <TableRow>
                                                  <TableCell colSpan={5} className="text-center py-8">
                                                       <Loader2 className="h-4 w-4 animate-spin mx-auto text-primary" />
                                                  </TableCell>
                                             </TableRow>
                                        ) : doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                       Belum ada data Radiolog.
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map((doc) => (
                                                  <TableRow key={doc.id}>
                                                       <TableCell className="font-medium">{doc.name}</TableCell>
                                                       <TableCell>{doc.specialization}</TableCell>
                                                       <TableCell>{doc.licenseNumber || "-"}</TableCell>
                                                       <TableCell>{doc.phone}</TableCell>
                                                       <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                                       </TableCell>
                                                  </TableRow>
                                             ))
                                        )}
                                   </TableBody>
                              </Table>
                         </div>
                    </CardContent>
               </Card>

               <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Tambah Radiolog</DialogTitle>
                              <DialogDescription>Masukkan data dokter spesialis radiologi baru.</DialogDescription>
                         </DialogHeader>
                         <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                   <Label htmlFor="name">Nama Lengkap</Label>
                                   <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="dr. Fulan" />
                              </div>
                              <div className="grid gap-2">
                                   <Label>Spesialisasi</Label>
                                   <Input value={formData.specialization} readOnly className="bg-slate-50" />
                              </div>
                              <div className="grid gap-2">
                                   <Label htmlFor="licenseNumber">Nomor SIP/STR</Label>
                                   <Input id="licenseNumber" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                   <Label htmlFor="phone">No. Telepon</Label>
                                   <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                              </div>
                              <Button onClick={handleSubmit} disabled={submitting}>
                                   {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                   Simpan
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>
          </div>
     );
}
