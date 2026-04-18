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

     if (status === "loading") return <div className="p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
     if (!isAuthenticated) return null;

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-3xl font-bold">Manajemen Dokter</h1>
                         <p className="text-muted-foreground">Kelola data dokter dan jadwal praktik</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline"><Printer className="w-4 h-4 mr-2" />Cetak</Button>
                         <Button onClick={openAddModal}><Plus className="w-4 h-4 mr-2" />Tambah Dokter</Button>
                    </div>
               </div>

               <Card>
                    <CardHeader>
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <CardTitle>Daftar Dokter</CardTitle>
                              <div className="relative w-full md:w-72">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                   <Input 
                                        placeholder="Cari dokter..." 
                                        className="pl-10" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                              </div>
                         </div>
                    </CardHeader>
                    <CardContent>
                         <div className="rounded-md border">
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>Nama</TableHead>
                                             <TableHead>Spesialisasi</TableHead>
                                             <TableHead>No. STR</TableHead>
                                             <TableHead>Telepon</TableHead>
                                             <TableHead>Status</TableHead>
                                             <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {loading ? (
                                             <TableRow>
                                                  <TableCell colSpan={6} className="text-center py-8">
                                                       <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                                  </TableCell>
                                             </TableRow>
                                        ) : filteredDoctors.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                       Tidak ada data dokter.
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             filteredDoctors.map(doctor => (
                                                  <TableRow key={doctor.id}>
                                                       <TableCell className="font-medium">{doctor.name}</TableCell>
                                                       <TableCell>{doctor.specialization}</TableCell>
                                                       <TableCell>{doctor.licenseNumber}</TableCell>
                                                       <TableCell>{doctor.phone}</TableCell>
                                                       <TableCell>
                                                            <Badge variant="outline" className={getStatusColor(doctor.status)}>
                                                                 {doctor.status}
                                                            </Badge>
                                                       </TableCell>
                                                       <TableCell className="text-right space-x-2">
                                                            <Button variant="ghost" size="sm" onClick={() => openEditModal(doctor)}><Edit className="w-4 h-4" /></Button>
                                                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(doctor.id)}><Trash2 className="w-4 h-4" /></Button>
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
                    <DialogContent className="max-w-2xl">
                         <DialogHeader>
                              <DialogTitle>{isEditModalOpen ? "Edit Dokter" : "Tambah Dokter"}</DialogTitle>
                              <DialogDescription>
                                   {isEditModalOpen ? "Perbarui detail dokter yang dipilih." : "Masukkan detail untuk menambahkan dokter baru ke sistem."}
                              </DialogDescription>
                         </DialogHeader>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                              <div className="space-y-2">
                                   <Label htmlFor="name">Nama Lengkap</Label>
                                   <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="contoh: dr. John Doe" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="specialization">Spesialisasi</Label>
                                   <Select value={formData.specialization} onValueChange={(v) => handleSelectChange("specialization", v)}>
                                        <SelectTrigger id="specialization"><SelectValue placeholder="Pilih Spesialisasi" /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Radiologi">Radiologi</SelectItem>
                                             <SelectItem value="Penyakit Dalam">Penyakit Dalam</SelectItem>
                                             <SelectItem value="Umum">Dokter Umum</SelectItem>
                                             <SelectItem value="Gigi">Gigi</SelectItem>
                                             <SelectItem value="Kebidanan">Kebidanan</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="licenseNumber">Nomor STR</Label>
                                   <Input id="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} placeholder="contoh: STR-12345" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="phone">No. Telepon</Label>
                                   <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="contoh: 0812..." />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="email">Email</Label>
                                   <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="contoh: doctor@prima.com" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="experience">Pengalaman (Tahun)</Label>
                                   <Input id="experience" type="number" value={formData.experience} onChange={handleInputChange} placeholder="0" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="status">Status</Label>
                                   <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Aktif">Aktif</SelectItem>
                                             <SelectItem value="Cuti">Cuti</SelectItem>
                                             <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                         </div>
                         <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Batal</Button>
                              <Button onClick={isEditModalOpen ? handleUpdate : handleSubmit} disabled={submitting}>
                                   {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                   {isEditModalOpen ? "Simpan Perubahan" : "Simpan Dokter"}
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>
          </div>
     );
}
