"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
     Plus, 
     Search, 
     Filter, 
     Loader2, 
     MoreVertical, 
     UserPlus,
     Mail,
     Phone,
     ShieldCheck
} from "lucide-react";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MedicalStaffSettingsPage() {
     const [staff, setStaff] = useState<any[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");
     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [submitting, setSubmitting] = useState(false);

     const [formData, setFormData] = useState({
          name: "",
          specialization: "",
          licenseNumber: "",
          phone: "",
          email: "",
          experience: "0",
          status: "Aktif"
     });

     const fetchStaff = async () => {
          setLoading(true);
          try {
               const res = await fetch("/api/doctors");
               if (res.ok) {
                    const data = await res.json();
                    setStaff(data);
               }
          } catch (e) {
               console.error("Failed to fetch staff:", e);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchStaff();
     }, []);

     const handleSubmit = async () => {
          if (!formData.name || !formData.specialization || !formData.licenseNumber) {
               alert("Mohon isi field wajib (Nama, Spesialisasi, SIP).");
               return;
          }

          setSubmitting(true);
          try {
               const res = await fetch("/api/doctors", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                         ...formData,
                         experience: parseInt(formData.experience)
                    })
               });

               if (res.ok) {
                    setIsAddModalOpen(false);
                    fetchStaff();
                    setFormData({
                         name: "",
                         specialization: "",
                         licenseNumber: "",
                         phone: "",
                         email: "",
                         experience: "0",
                         status: "Aktif"
                    });
               } else {
                    const err = await res.json();
                    alert(`Gagal: ${err.error || "Terjadi kesalahan"}`);
               }
          } catch (e) {
               console.error("Submit error:", e);
               alert("Terjadi kesalahan sistem.");
          } finally {
               setSubmitting(false);
          }
     };

     const filteredStaff = staff.filter(person => 
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (person.licenseNumber && person.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()))
     );

     const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

     const openDetailModal = (person: any) => {
          setSelectedStaff(person);
          setIsDetailModalOpen(true);
     };

     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                         <h3 className="text-2xl font-bold text-[#125eab]">Tenaga Medis & Staff</h3>
                         <p className="text-sm text-muted-foreground">
                              Kelola data dokter, perawat, dan tenaga profesional lainnya.
                         </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                         <Button variant="outline" className="flex-1 sm:flex-none">
                              <Filter className="w-4 h-4 mr-2" />
                              Filter
                         </Button>
                         <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#125eab] hover:bg-blue-700 flex-1 sm:flex-none shadow-md transition-all hover:scale-105">
                              <Plus className="w-4 h-4 mr-2" />
                              Tambah Staff
                         </Button>
                    </div>
               </div>

               <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                         <Input 
                              placeholder="Cari nama, spesialisasi, atau SIP..." 
                              className="pl-10 bg-white border-slate-200" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                         />
                    </div>
               </div>

               <div className="grid gap-3">
                    {loading ? (
                         <div className="py-12 text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#125eab] opacity-50" />
                              <p className="mt-2 text-slate-400">Memuat data tenaga medis...</p>
                         </div>
                    ) : filteredStaff.length === 0 ? (
                         <div className="py-12 text-center border-2 border-dashed rounded-lg bg-slate-50">
                              <UserPlus className="w-12 h-12 mx-auto text-slate-200" />
                              <p className="mt-2 text-slate-500 font-medium">Belum ada data staff yang ditemukan</p>
                         </div>
                    ) : (
                         filteredStaff.map((person) => (
                              <Card key={person.id} className="group flex items-center p-4 justify-between hover:border-[#125eab] hover:bg-blue-50/20 transition-all border-slate-200 shadow-sm">
                                   <div className="flex items-center gap-4">
                                        <div className="relative">
                                             <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} />
                                                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                                                       {person.name.substring(0, 2).toUpperCase()}
                                                  </AvatarFallback>
                                             </Avatar>
                                             <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                                                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                                             </div>
                                        </div>
                                        <div className="space-y-0.5">
                                             <div className="flex items-center gap-2">
                                                  <h4 className="font-bold text-slate-800 group-hover:text-[#125eab] transition-colors">{person.name}</h4>
                                                  <Badge variant={person.status === "Aktif" ? "outline" : "secondary"} className={person.status === "Aktif" ? "text-green-600 border-green-200 bg-green-50 text-[10px] h-4" : "text-[10px] h-4"}>
                                                       {person.status}
                                                  </Badge>
                                             </div>
                                             <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium text-slate-600">{person.specialization}</span>
                                                  <span>•</span>
                                                  <span className="font-mono">SIP: {person.licenseNumber || "-"}</span>
                                             </div>
                                        </div>
                                   </div>
                                   <div className="flex items-center gap-4">
                                        <div className="hidden md:flex flex-col items-end gap-1 text-[11px] text-slate-400 pr-4 border-r">
                                             <div className="flex items-center gap-1.5 font-medium">
                                                  <span>{person.phone || '-'}</span>
                                                  <Phone className="w-3 h-3" />
                                             </div>
                                             <div className="flex items-center gap-1.5 font-medium">
                                                  <span>{person.email || '-'}</span>
                                                  <Mail className="w-3 h-3" />
                                             </div>
                                        </div>
                                        <div className="flex gap-1">
                                             <Button variant="ghost" size="sm" className="text-[#125eab] font-bold hover:bg-blue-50" onClick={() => openDetailModal(person)}>Detail</Button>
                                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                                                  <MoreVertical className="w-4 h-4" />
                                             </Button>
                                        </div>
                                   </div>
                              </Card>
                         ))
                    )}
               </div>

               <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="sm:max-w-[600px] bg-white border-none shadow-2xl">
                         <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-[#125eab]">Tambah Tenaga Medis</DialogTitle>
                              <DialogDescription className="text-slate-400 font-medium">
                                   Daftarkan dokter, perawat, atau tenaga medis baru ke sistem.
                              </DialogDescription>
                         </DialogHeader>
                         <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 my-2">
                              <div className="space-y-2 col-span-2">
                                   <Label htmlFor="staff-name" className="text-xs font-bold uppercase text-slate-500">Nama Lengkap & Gelar</Label>
                                   <Input id="staff-name" placeholder="Contoh: dr. Andi Wijaya, Sp.PD" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="border-slate-200" />
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="specialty" className="text-xs font-bold uppercase text-slate-500">Spesialisasi / Peran</Label>
                                   <Select value={formData.specialization} onValueChange={(v) => setFormData({...formData, specialization: v})}>
                                        <SelectTrigger className="border-slate-200"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Dokter Umum">Dokter Umum</SelectItem>
                                             <SelectItem value="Dokter Gigi">Dokter Gigi</SelectItem>
                                             <SelectItem value="Radiologi">Dokter Radiologi</SelectItem>
                                             <SelectItem value="Perawat">Perawat</SelectItem>
                                             <SelectItem value="Apoteker">Apoteker</SelectItem>
                                             <SelectItem value="Admin">Administrasi</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="sip" className="text-xs font-bold uppercase text-slate-500">No. SIP / STR</Label>
                                   <Input id="sip" placeholder="123.XXX.YYY" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} className="border-slate-200 font-mono" />
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500">No. WhatsApp</Label>
                                   <Input id="phone" placeholder="08xxxxxxxxxxx" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border-slate-200" />
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Email Kerja</Label>
                                   <Input id="email" type="email" placeholder="nama@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border-slate-200" />
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="exp" className="text-xs font-bold uppercase text-slate-500">Pengalaman (Tahun)</Label>
                                   <Input id="exp" type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="border-slate-200" />
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="status" className="text-xs font-bold uppercase text-slate-500">Status Aktif</Label>
                                   <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                                        <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Aktif">Aktif</SelectItem>
                                             <SelectItem value="Cuti">Cuti</SelectItem>
                                             <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                         </div>
                         <div className="flex justify-end gap-3 pt-2">
                              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">Batal</Button>
                              <Button onClick={handleSubmit} disabled={submitting} className="bg-[#125eab] hover:bg-blue-700 min-w-[120px] shadow-lg shadow-blue-200">
                                   {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                   Simpan Staff
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>

               {/* DETAIL MODAL */}
               <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="max-w-2xl bg-white border-none shadow-2xl p-0 overflow-hidden">
                         {selectedStaff && (
                              <>
                                   <div className="bg-[#125eab] p-8 text-white">
                                        <div className="flex gap-6 items-center">
                                             <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStaff.name}`} />
                                                  <AvatarFallback className="bg-white text-[#125eab] font-bold text-xl">
                                                       {selectedStaff.name.substring(0, 2).toUpperCase()}
                                                  </AvatarFallback>
                                             </Avatar>
                                             <div className="space-y-1">
                                                  <h2 className="text-2xl font-bold tracking-tight">{selectedStaff.name}</h2>
                                                  <p className="text-blue-100 font-medium tracking-wide uppercase text-xs opacity-80">{selectedStaff.specialization}</p>
                                                  <div className="flex gap-2 mt-3">
                                                       <Badge className="bg-white/20 text-white border-none text-[10px] font-bold font-mono">
                                                            SIP: {selectedStaff.licenseNumber || "-"}
                                                       </Badge>
                                                       <Badge className="bg-green-400/30 text-green-100 border-none text-[10px] font-bold animate-pulse">
                                                            {selectedStaff.status}
                                                       </Badge>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <div className="p-8 grid grid-cols-2 gap-8 bg-slate-50/50">
                                        <div className="space-y-6">
                                             <div className="space-y-1">
                                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informasi Kontak</p>
                                                  <div className="space-y-3 mt-3">
                                                       <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#125eab]">
                                                                 <Phone className="w-4 h-4" />
                                                            </div>
                                                            {selectedStaff.phone || "-"}
                                                       </div>
                                                       <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#125eab]">
                                                                 <Mail className="w-4 h-4" />
                                                            </div>
                                                            <span className="truncate max-w-[150px]">{selectedStaff.email || "-"}</span>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="space-y-6">
                                             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Pengalaman</p>
                                                  <div className="flex items-baseline gap-2">
                                                       <span className="text-4xl font-light text-[#125eab]">{selectedStaff.experience || 0}</span>
                                                       <span className="text-xs font-bold text-slate-500 uppercase">Tahun</span>
                                                  </div>
                                                  <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-1">
                                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akses Sistem</p>
                                                       <p className="text-xs font-bold text-slate-600">Full Dashboard Access</p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <div className="px-8 py-4 bg-slate-100/30 border-t flex justify-end">
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
