"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
     Dialog, 
     DialogContent, 
     DialogHeader, 
     DialogTitle, 
     DialogDescription,
     DialogFooter
} from "@/components/ui/dialog";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Loader2 } from "lucide-react";
import { Patient } from "@prisma/client";

export default function PatientsPage() {
     const [patients, setPatients] = useState<Patient[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");
     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [submitting, setSubmitting] = useState(false);

     const [formData, setFormData] = useState({
          name: "",
          nik: "",
          bpjsNo: "",
          gender: "L",
          birthDate: "",
          phone: "",
          address: "",
          registrationNo: ""
     });

     useEffect(() => {
          fetchPatients();
     }, []);

     const fetchPatients = async () => {
          setLoading(true);
          try {
               const response = await fetch("/api/patients");
               const data = await response.json();
               setPatients(data);
          } catch (error) {
               console.error("Failed to fetch patients:", error);
          } finally {
               setLoading(false);
          }
     };

     const handleSubmit = async () => {
          if (!formData.name || !formData.birthDate || !formData.gender) {
               alert("Nama, Tanggal Lahir, dan Jenis Kelamin wajib diisi!");
               return;
          }

          setSubmitting(true);
          try {
               // Generate registration number if empty
               const registrationNo = formData.registrationNo || `RM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
               
               const response = await fetch("/api/patients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                         ...formData,
                         registrationNo,
                         birthDate: new Date(formData.birthDate).toISOString()
                    }),
               });

               if (response.ok) {
                    setIsAddModalOpen(false);
                    setFormData({
                         name: "", nik: "", bpjsNo: "", gender: "L", birthDate: "", phone: "", address: "", registrationNo: ""
                    });
                    fetchPatients();
               } else {
                    const err = await response.json();
                    alert(`Gagal: ${err.error || "Terjadi kesalahan"}`);
               }
          } catch (error) {
               console.error("Error creating patient:", error);
               alert("Terjadi kesalahan saat menyimpan data.");
          } finally {
               setSubmitting(false);
          }
     };

     const filteredPatients = patients.filter(patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.registrationNo.toLowerCase().includes(searchTerm.toLowerCase())
     );

     const getAge = (birthDate: Date) => {
          if (!birthDate) return 0;
          const today = new Date();
          const birth = new Date(birthDate);
          let age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
               age--;
          }
          return age;
     };

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold">Pasien</h1>
                         <p className="text-muted-foreground">Kelola data pasien dan rekam medis.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                         <Plus className="w-4 h-4 mr-2" /> Tambah Pasien
                    </Button>
               </div>

               <Card>
                    <CardContent className="pt-6">
                         <div className="flex items-center gap-4 mb-6">
                              <div className="relative flex-1">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                   <Input 
                                        placeholder="Cari nama pasien atau No. RM..." 
                                        className="pl-10" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                              </div>
                         </div>

                         <div className="rounded-md border">
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>No. RM</TableHead>
                                             <TableHead>Nama Pasien</TableHead>
                                             <TableHead>Gender</TableHead>
                                             <TableHead>Usia</TableHead>
                                             <TableHead>No. Telepon</TableHead>
                                             <TableHead>Alamat</TableHead>
                                             <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {loading ? (
                                             <TableRow>
                                                  <TableCell colSpan={7} className="text-center py-8">
                                                       <div className="flex justify-center items-center gap-2">
                                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                            <span>Memuat data...</span>
                                                       </div>
                                                  </TableCell>
                                             </TableRow>
                                        ) : filteredPatients.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                       {searchTerm ? "Pasien tidak ditemukan." : "Belum ada data pasien."}
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             filteredPatients.map((patient) => (
                                                  <TableRow key={patient.id}>
                                                       <TableCell className="font-medium">{patient.registrationNo}</TableCell>
                                                       <TableCell>{patient.name}</TableCell>
                                                       <TableCell>{patient.gender === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
                                                       <TableCell>{getAge(patient.birthDate)} th</TableCell>
                                                       <TableCell>{patient.phone}</TableCell>
                                                       <TableCell className="max-w-xs truncate">{patient.address}</TableCell>
                                                       <TableCell className="text-right">
                                                            <Button size="sm" variant="ghost">Detail</Button>
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
                    <DialogContent className="max-w-2xl">
                         <DialogHeader>
                              <DialogTitle>Tambah Pasien Baru</DialogTitle>
                              <DialogDescription>Lengkapi data pasien di bawah ini.</DialogDescription>
                         </DialogHeader>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                              <div className="space-y-2">
                                   <Label htmlFor="name">Nama Lengkap</Label>
                                   <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nama Pasien" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="nik">NIK (No. KTP)</Label>
                                   <Input id="nik" value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} placeholder="320..." />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="birthDate">Tanggal Lahir</Label>
                                   <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="gender">Jenis Kelamin</Label>
                                   <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="L">Laki-laki</SelectItem>
                                             <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="phone">No. Telepon</Label>
                                   <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="08..." />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="bpjsNo">No. BPJS (Opsional)</Label>
                                   <Input id="bpjsNo" value={formData.bpjsNo} onChange={(e) => setFormData({...formData, bpjsNo: e.target.value})} placeholder="000..." />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                   <Label htmlFor="address">Alamat</Label>
                                   <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Alamat Lengkap" />
                              </div>
                         </div>

                         <DialogFooter>
                              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                              <Button onClick={handleSubmit} disabled={submitting}>
                                   {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                   Simpan Pasien
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>
     );
}
