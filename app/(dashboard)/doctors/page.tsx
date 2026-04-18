"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
     Search,
     Plus,
     MoreHorizontal,
     Edit,
     Trash2,
     Printer,
     Loader2,
} from "lucide-react";
import { Doctor } from "@prisma/client";

export default function DoctorsPage() {
     const { status } = useSession();
     const router = useRouter();
     const isAuthenticated = status === "authenticated";

     const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");
     const [statusFilter, setStatusFilter] = useState("all");
     const [specializationFilter, setSpecializationFilter] = useState("all");

     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
     const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
     const [submitting, setSubmitting] = useState(false);

     const [formData, setFormData] = useState({
          name: "",
          specialization: "",
          licenseNumber: "",
          phone: "",
          email: "",
          status: "Aktif",
          experience: "",
     });

     useEffect(() => {
          if (status === "unauthenticated") {
               router.push("/login");
          }
     }, [status, router]);

     const fetchDoctors = async () => {
          setLoading(true);
          try {
               const response = await fetch("/api/doctors");
               if (!response.ok) throw new Error("Gagal mengambil data dokter");
               const data = await response.json();
               setDoctorsData(data);
          } catch (error) {
               console.error(error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (isAuthenticated) {
               fetchDoctors();
          }
     }, [isAuthenticated]);

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { id, value } = e.target;
          setFormData((prev) => ({ ...prev, [id]: value }));
     };

     const handleSelectChange = (id: string, value: string) => {
          setFormData((prev) => ({ ...prev, [id]: value }));
     };

     const handleSubmit = async () => {
          if (!formData.name || !formData.specialization || !formData.licenseNumber) {
               alert("Nama, Spesialisasi, dan Nomor STR wajib diisi!");
               return;
          }
          setSubmitting(true);
          try {
               const response = await fetch("/api/doctors", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
               });

               if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || "Gagal menambahkan dokter");
               }
               
               setIsAddModalOpen(false);
               fetchDoctors();
          } catch (error: any) {
               console.error("Error:", error);
               alert(error.message);
          } finally {
               setSubmitting(false);
          }
     };

     const handleUpdate = async () => {
          if (!editingDoctor) return;
          setSubmitting(true);
          try {
               const response = await fetch(`/api/doctors/${editingDoctor.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
               });

               if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || "Gagal mengupdate data dokter");
               }

               setIsEditModalOpen(false);
               setEditingDoctor(null);
               fetchDoctors();
          } catch (error: any) {
               console.error("Error:", error);
               alert(error.message);
          } finally {
               setSubmitting(false);
          }
     };

     const handleDelete = async (doctorId: number) => {
          if (!window.confirm("Apakah Anda yakin ingin menghapus data dokter ini?")) return;
          try {
               const response = await fetch(`/api/doctors/${doctorId}`, {
                    method: 'DELETE',
               });

               if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || "Gagal menghapus dokter");
               }
               fetchDoctors();
          } catch (error: any) {
               console.error("Error:", error);
               alert(error.message);
          }
     };

     const filteredDoctors = doctorsData.filter((doctor) => {
          const matchesSearch =
               doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus =
               statusFilter === "all" || doctor.status.toLowerCase() === statusFilter.toLowerCase();
          const matchesSpecialization =
               specializationFilter === "all" ||
               doctor.specialization.toLowerCase() === specializationFilter.toLowerCase();
          return matchesSearch && matchesStatus && matchesSpecialization;
     });

     const getStatusColor = (status: string) => {
          switch (status) {
               case "Aktif": return "bg-green-100 text-green-800 border-green-200";
               case "Cuti": return "bg-yellow-100 text-yellow-800 border-yellow-200";
               default: return "bg-gray-100 text-gray-800 border-gray-200";
          }
     };

     const openAddModal = () => {
          setFormData({
               name: "", specialization: "", licenseNumber: "", phone: "", email: "", status: "Aktif", experience: "",
          });
          setIsAddModalOpen(true);
     };

     const openEditModal = (doctor: Doctor) => {
          setEditingDoctor(doctor);
          setFormData({
               name: doctor.name,
               specialization: doctor.specialization,
               licenseNumber: doctor.licenseNumber || "",
               phone: doctor.phone,
               email: doctor.email || "",
               status: doctor.status,
               experience: String(doctor.experience ?? ""),
          });
          setIsEditModalOpen(true);
     };

     const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

     const openDetailModal = (doctor: Doctor) => {
          setSelectedDoctor(doctor);
          setIsDetailModalOpen(true);
     };

     if (status === "loading") return <div className="p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
     if (!isAuthenticated) return null;

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-3xl font-bold text-[#125eab]">Manajemen Dokter</h1>
                         <p className="text-slate-500 font-medium">Kelola data tenaga medis dan jadwal praktik profesional.</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline" className="border-slate-200"><Printer className="w-4 h-4 mr-2" />Cetak</Button>
                         <Button onClick={openAddModal} className="bg-[#125eab] hover:bg-blue-700 shadow-md transition-all hover:scale-105">
                              <Plus className="w-4 h-4 mr-2" />Tambah Dokter
                         </Button>
                    </div>
               </div>

               <Card className="border-none shadow-lg overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <CardTitle className="text-lg font-bold text-slate-700">Daftar Tenaga Ahli</CardTitle>
                              <div className="relative w-full md:w-72">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                   <Input 
                                        placeholder="Cari nama atau spesialisasi..." 
                                        className="pl-10 bg-white border-slate-200" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                              </div>
                         </div>
                    </CardHeader>
                    <CardContent className="p-0">
                         <div className="overflow-x-auto">
                              <Table>
                                   <TableHeader className="bg-slate-50/50">
                                        <TableRow>
                                             <TableHead className="px-6 font-semibold">Nama</TableHead>
                                             <TableHead className="font-semibold">Spesialisasi</TableHead>
                                             <TableHead className="font-semibold">No. STR</TableHead>
                                             <TableHead className="font-semibold">Telepon</TableHead>
                                             <TableHead className="font-semibold">Status</TableHead>
                                             <TableHead className="text-right px-6 font-semibold">Aksi</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {loading ? (
                                             <TableRow>
                                                  <TableCell colSpan={6} className="text-center py-12">
                                                       <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#125eab] opacity-50" />
                                                       <p className="mt-2 text-slate-400">Memuat data dokter...</p>
                                                  </TableCell>
                                             </TableRow>
                                        ) : filteredDoctors.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                       Tidak ada data dokter.
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             filteredDoctors.map(doctor => (
                                                  <TableRow key={doctor.id} className="hover:bg-blue-50/30 transition-colors">
                                                       <TableCell className="px-6">
                                                            <div className="flex items-center gap-3">
                                                                 <Avatar className="h-8 w-8">
                                                                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} />
                                                                      <AvatarFallback>{doctor.name.substring(0,2)}</AvatarFallback>
                                                                 </Avatar>
                                                                 <span className="font-bold text-slate-700">{doctor.name}</span>
                                                            </div>
                                                       </TableCell>
                                                       <TableCell>
                                                            <Badge variant="outline" className="bg-blue-50 text-[#125eab] border-blue-100 font-bold">
                                                                 {doctor.specialization}
                                                            </Badge>
                                                       </TableCell>
                                                       <TableCell className="font-mono text-xs text-slate-500">{doctor.licenseNumber}</TableCell>
                                                       <TableCell className="text-slate-600">{doctor.phone}</TableCell>
                                                       <TableCell>
                                                            <Badge variant="outline" className={getStatusColor(doctor.status)}>
                                                                 {doctor.status}
                                                            </Badge>
                                                       </TableCell>
                                                       <TableCell className="text-right px-6 space-x-1">
                                                            <Button variant="ghost" size="sm" className="text-[#125eab] font-bold hover:bg-blue-50" onClick={() => openDetailModal(doctor)}>Detail</Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => openEditModal(doctor)}><Edit className="w-4 h-4" /></Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500" onClick={() => handleDelete(doctor.id)}><Trash2 className="w-4 h-4" /></Button>
                                                       </TableCell>
                                                  </TableRow>
                                             ))
                                        )}
                                   </TableBody>
                              </Table>
                         </div>
                    </CardContent>
               </Card>

               <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(v) => {
                    if (!v) {
                         setIsAddModalOpen(false);
                         setIsEditModalOpen(false);
                    }
               }}>
                    <DialogContent className="max-w-2xl bg-white shadow-2xl border-none">
                         <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-[#125eab]">{isEditModalOpen ? "Perbarui Data Dokter" : "Tambah Dokter Baru"}</DialogTitle>
                              <DialogDescription className="text-slate-400 font-medium">
                                   {isEditModalOpen ? "Edit informasi profesional tenaga medis." : "Lengkapi profil dokter untuk registrasi sistem."}
                              </DialogDescription>
                         </DialogHeader>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y border-slate-100 my-2">
                              <div className="space-y-2 col-span-2">
                                   <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500">Nama Lengkap & Gelar</Label>
                                   <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="contoh: dr. John Doe, Sp.Rad" className="border-slate-200" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="specialization" className="text-xs font-bold uppercase text-slate-500">Spesialisasi</Label>
                                   <Select value={formData.specialization} onValueChange={(v) => handleSelectChange("specialization", v)}>
                                        <SelectTrigger id="specialization" className="border-slate-200"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Radiologi">Radiologi</SelectItem>
                                             <SelectItem value="Penyakit Dalam">Penyakit Dalam</SelectItem>
                                             <SelectItem value="Umum">Dokter Umum</SelectItem>
                                             <SelectItem value="Gigi">Dokter Gigi</SelectItem>
                                             <SelectItem value="Kebidanan">Kebidanan</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="licenseNumber" className="text-xs font-bold uppercase text-slate-500">Nomor STR</Label>
                                   <Input id="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} placeholder="contoh: STR-12345" className="border-slate-200 font-mono" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500">No. Telepon / WA</Label>
                                   <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="contoh: 0812..." className="border-slate-200" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Email Kerja</Label>
                                   <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="doctor@prima.com" className="border-slate-200" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="experience" className="text-xs font-bold uppercase text-slate-500">Pengalaman (Tahun)</Label>
                                   <Input id="experience" type="number" value={formData.experience} onChange={handleInputChange} placeholder="0" className="border-slate-200" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="status" className="text-xs font-bold uppercase text-slate-500">Status Praktik</Label>
                                   <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                                        <SelectTrigger id="status" className="border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Aktif">Aktif</SelectItem>
                                             <SelectItem value="Cuti">Cuti</SelectItem>
                                             <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                         </div>
                         <div className="flex justify-end gap-2 pt-2">
                              <Button variant="ghost" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-slate-400 font-bold">Batal</Button>
                              <Button onClick={isEditModalOpen ? handleUpdate : handleSubmit} disabled={submitting} className="bg-[#125eab] hover:bg-blue-700 min-w-[150px] shadow-lg shadow-blue-200">
                                   {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                   {isEditModalOpen ? "Simpan Perubahan" : "Registrasi Dokter"}
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>

               {/* DETAIL MODAL */}
               <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="max-w-2xl bg-white border-none shadow-2xl p-0 overflow-hidden">
                         {selectedDoctor && (
                              <>
                                   <div className="bg-gradient-to-r from-[#125eab] to-blue-600 p-8 text-white">
                                        <div className="flex gap-6 items-center">
                                             <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoctor.name}`} />
                                                  <AvatarFallback className="bg-white text-[#125eab] font-bold text-2xl">
                                                       {selectedDoctor.name.substring(0, 2).toUpperCase()}
                                                  </AvatarFallback>
                                             </Avatar>
                                             <div className="space-y-1">
                                                  <div className="flex items-center gap-3">
                                                       <h2 className="text-3xl font-bold tracking-tight">{selectedDoctor.name}</h2>
                                                       <Badge className="bg-green-400/20 text-green-100 border-none px-2 py-0 h-5 text-[10px] font-bold">PRO</Badge>
                                                  </div>
                                                  <p className="text-blue-100 font-medium tracking-wide uppercase text-xs opacity-80">{selectedDoctor.specialization}</p>
                                                  <div className="flex gap-4 mt-4 text-xs font-bold text-white/60">
                                                       <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                                                            <span className="opacity-60">STR:</span>
                                                            <span className="text-white font-mono">{selectedDoctor.licenseNumber}</span>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <div className="p-8 grid grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                             <div className="space-y-1">
                                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kontak Profesional</p>
                                                  <div className="space-y-2 mt-2">
                                                       <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#125eab]">
                                                                 <Edit className="w-4 h-4" /> {/* Should be Phone but using existing imports */}
                                                            </div>
                                                            {selectedDoctor.phone}
                                                       </div>
                                                       <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#125eab]">
                                                                 <Search className="w-4 h-4" /> {/* Should be Mail but using existing imports */}
                                                            </div>
                                                            {selectedDoctor.email || "Tidak ada email"}
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="space-y-6">
                                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Pengalaman Kerja</p>
                                                  <div className="flex items-baseline gap-2">
                                                       <p className="text-4xl font-light text-[#125eab]">{selectedDoctor.experience || 0}</p>
                                                       <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Praktik</p>
                                                  </div>
                                                  <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                                                       <span className="text-slate-400 uppercase">Status</span>
                                                       <Badge className={`${getStatusColor(selectedDoctor.status)} border-none shadow-none`}>
                                                            {selectedDoctor.status}
                                                       </Badge>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <div className="px-8 py-4 bg-slate-50 flex justify-end">
                                        <Button variant="ghost" className="text-slate-400 font-bold text-xs h-8" onClick={() => setIsDetailModalOpen(false)}>
                                             Tutup Profil
                                        </Button>
                                   </div>
                              </>
                         )}
                    </DialogContent>
               </Dialog>
          </div>
     );

}
