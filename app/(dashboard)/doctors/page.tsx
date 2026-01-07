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
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
     Eye,
     Edit,
     Trash2,
     Phone,
     Printer,
} from "lucide-react";

type Doctor = {
     id: number;
     name: string;
     specialization: string;
     license_number: string;
     phone: string;
     email: string;
     experience: number;
     status: string;
     avatar?: string;
};

export default function Doctors() {
     const { status } = useSession();
     const router = useRouter();
     const isAuthenticated = status === "authenticated";

     const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
     const [searchTerm, setSearchTerm] = useState("");
     const [statusFilter, setStatusFilter] = useState("all");
     const [specializationFilter, setSpecializationFilter] = useState("all");

     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
     const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
     const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

     const [formData, setFormData] = useState({
          name: "",
          specialization: "",
          license_number: "",
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
          try {
               const response = await fetch("/api/doctors");
               if (!response.ok) throw new Error("Gagal mengambil data dokter");
               const data = await response.json();
               setDoctorsData(data);
          } catch (error) {
               console.error(error);
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
          if (!formData.name || !formData.specialization || !formData.license_number) {
               alert("Nama, Spesialisasi, dan Nomor STR wajib diisi!");
               return;
          }
          try {
               const response = await fetch("/api/doctors", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
               });

               if (!response.ok) throw new Error(await response.text());
               alert("Dokter baru berhasil ditambahkan.");
               closeAddModal();
               fetchDoctors();
          } catch (error) {
               console.error("Error:", error);
               alert((error as Error).message);
          }
     };

     const handleUpdate = async () => {
          if (!editingDoctor) return;
          try {
               const response = await fetch(`/api/doctors/${editingDoctor.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
               });

               if (!response.ok) throw new Error(await response.text());
               alert("Data dokter berhasil diupdate.");
               closeEditModal();
               fetchDoctors();
          } catch (error) {
               console.error("Error:", error);
               alert((error as Error).message);
          }
     };

     const handleDelete = async (doctorId: number) => {
          if (!window.confirm("Apakah Anda yakin ingin menghapus data dokter ini?")) return;
          try {
               const response = await fetch(`/api/doctors/${doctorId}`, {
                    method: 'DELETE',
               });

               if (!response.ok) throw new Error(await response.text());
               alert("Dokter berhasil dihapus.");
               fetchDoctors();
          } catch (error) {
               console.error("Error:", error);
               alert((error as Error).message);
          }
     };

     const filteredDoctors = doctorsData.filter((doctor) => {
          const matchesSearch =
               doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               String(doctor.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
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

     const getInitials = (name: string) => {
          return name.split(" ").map((n) => n[0]).join("").toUpperCase();
     };

     const openAddModal = () => {
          setFormData({
               name: "", specialization: "", license_number: "", phone: "", email: "", status: "Aktif", experience: "",
          });
          setIsAddModalOpen(true);
     };
     const closeAddModal = () => setIsAddModalOpen(false);

     const openEditModal = (doctor: Doctor) => {
          setEditingDoctor(doctor);
          setFormData({
               name: doctor.name,
               specialization: doctor.specialization,
               license_number: doctor.license_number,
               phone: doctor.phone,
               email: doctor.email,
               status: doctor.status,
               experience: String(doctor.experience),
          });
          setIsEditModalOpen(true);
     };
     const closeEditModal = () => {
          setIsEditModalOpen(false);
          setEditingDoctor(null);
     };

     if (status === "loading") return <div className="p-8">Loading...</div>;
     if (!isAuthenticated) return null;

     return (
          <div className="container mx-auto py-8 px-4 space-y-6">
               {/* ... existing UI adapted ... */}
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-3xl font-bold text-foreground">Manajemen Dokter</h1>
                         <p className="text-muted-foreground">Kelola data dokter dan jadwal praktik</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline"><Printer className="w-4 h-4 mr-2" />Cetak</Button>
                         <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                              <DialogTrigger asChild><Button onClick={openAddModal}><Plus className="w-4 h-4 mr-2" />Tambah Dokter</Button></DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                   {/* Modals content */}
                                   <DialogHeader>
                                        <DialogTitle>Tambah Dokter</DialogTitle>
                                        <DialogDescription>Masukkan detail dokter baru.</DialogDescription>
                                   </DialogHeader>
                                   <div className="grid grid-cols-2 gap-4 py-4">
                                        <div className="space-y-2"><Label htmlFor="name">Nama</Label><Input id="name" value={formData.name} onChange={handleInputChange} /></div>
                                        <div className="space-y-2">
                                             <Label htmlFor="specialization">Spesialisasi</Label>
                                             <Select value={formData.specialization} onValueChange={(v: string) => handleSelectChange("specialization", v)}>
                                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value="Radiologi">Radiologi</SelectItem>
                                                       <SelectItem value="Patologi">Patologi</SelectItem>
                                                       <SelectItem value="Dokter Umum">Dokter Umum</SelectItem>
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                        {/* ... other inputs ... */}
                                        <div className="space-y-2"><Label htmlFor="license_number">Nomor STR</Label><Input id="license_number" value={formData.license_number} onChange={handleInputChange} /></div>
                                        <div className="space-y-2"><Label htmlFor="phone">Telepon</Label><Input id="phone" value={formData.phone} onChange={handleInputChange} /></div>
                                        <div className="col-span-2 space-y-2"><Label htmlFor="email">Email</Label><Input id="email" value={formData.email} onChange={handleInputChange} /></div>
                                        <div className="space-y-2"><Label htmlFor="experience">Pengalaman</Label><Input id="experience" type="number" value={formData.experience} onChange={handleInputChange} /></div>
                                   </div>
                                   <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={closeAddModal}>Batal</Button>
                                        <Button onClick={handleSubmit}>Simpan</Button>
                                   </div>
                              </DialogContent>
                         </Dialog>
                    </div>
               </div>

               {/* Table */}
               <Card>
                    <CardHeader>
                         <CardTitle>Daftar Dokter</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Spesialisasi</TableHead>
                                        <TableHead>Aksi</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {filteredDoctors.map(doctor => (
                                        <TableRow key={doctor.id}>
                                             <TableCell>{doctor.name}</TableCell>
                                             <TableCell>{doctor.specialization}</TableCell>
                                             <TableCell>
                                                  <Button variant="ghost" size="sm" onClick={() => openEditModal(doctor)}><Edit className="w-4 h-4" /></Button>
                                                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(doctor.id)}><Trash2 className="w-4 h-4" /></Button>
                                             </TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}
