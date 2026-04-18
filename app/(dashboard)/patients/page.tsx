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

     const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

     const handleOpenDetail = (patient: Patient) => {
          setSelectedPatient(patient);
          setIsDetailModalOpen(true);
     };

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold text-[#125eab]">Pasien</h1>
                         <p className="text-slate-500 font-medium">Kelola data pasien dan rekam medis terpadu.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#125eab] hover:bg-blue-700 shadow-md">
                         <Plus className="w-4 h-4 mr-2" /> Tambah Pasien
                    </Button>
               </div>

               <Card className="border-none shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                         <div className="p-4 bg-slate-50 border-b flex items-center gap-4">
                              <div className="relative flex-1 max-w-sm">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                   <Input 
                                        placeholder="Cari nama pasien atau No. RM..." 
                                        className="pl-10 bg-white border-slate-200" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                              </div>
                         </div>

                         <div className="overflow-x-auto">
                              <Table>
                                   <TableHeader className="bg-slate-50/50">
                                        <TableRow>
                                             <TableHead className="px-6 font-semibold">No. RM</TableHead>
                                             <TableHead className="font-semibold">Nama Pasien</TableHead>
                                             <TableHead className="font-semibold">Gender</TableHead>
                                             <TableHead className="font-semibold">Usia</TableHead>
                                             <TableHead className="font-semibold">No. Telepon</TableHead>
                                             <TableHead className="font-semibold">Alamat</TableHead>
                                             <TableHead className="text-right px-6 font-semibold">Aksi</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {loading ? (
                                             <TableRow>
                                                  <TableCell colSpan={7} className="text-center py-12">
                                                       <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#125eab] opacity-50" />
                                                       <p className="mt-2 text-slate-400">Memuat data pasien...</p>
                                                  </TableCell>
                                             </TableRow>
                                        ) : filteredPatients.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={7} className="text-center py-12">
                                                       <p className="text-slate-400">
                                                            {searchTerm ? "Pasien tidak ditemukan." : "Belum ada data pasien."}
                                                       </p>
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             filteredPatients.map((patient) => (
                                                  <TableRow key={patient.id} className="hover:bg-blue-50/30 transition-colors">
                                                       <TableCell className="px-6 font-mono text-xs font-bold text-slate-500">{patient.registrationNo}</TableCell>
                                                       <TableCell className="font-bold text-slate-700">{patient.name}</TableCell>
                                                       <TableCell>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${patient.gender === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                                 {patient.gender === "L" ? "Laki-laki" : "Perempuan"}
                                                            </span>
                                                       </TableCell>
                                                       <TableCell className="font-medium text-slate-600">{getAge(patient.birthDate)} th</TableCell>
                                                       <TableCell className="text-slate-500">{patient.phone}</TableCell>
                                                       <TableCell className="max-w-xs truncate text-slate-400 text-sm">{patient.address}</TableCell>
                                                       <TableCell className="text-right px-6">
                                                            <Button size="sm" variant="ghost" className="text-[#125eab] font-bold hover:bg-blue-50" onClick={() => handleOpenDetail(patient)}>Detail</Button>
                                                       </TableCell>
                                                  </TableRow>
                                             ))
                                        )}
                                   </TableBody>
                              </Table>
                         </div>
                    </CardContent>
               </Card>

               {/* ADD MODAL */}
               <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="max-w-2xl bg-white border-none shadow-2xl">
                         <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-[#125eab]">Tambah Pasien Baru</DialogTitle>
                              <DialogDescription className="text-slate-400 font-medium">Lengkapi identitas pasien secara akurat untuk pendaftaran medis.</DialogDescription>
                         </DialogHeader>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-slate-100 my-2">
                              <div className="space-y-2">
                                   <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500">Nama Lengkap</Label>
                                   <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nama Sesuai KTP" className="border-slate-200 focus:border-[#125eab] focus:ring-1 focus:ring-[#125eab]" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="nik" className="text-xs font-bold uppercase text-slate-500">NIK (No. KTP)</Label>
                                   <Input id="nik" value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} placeholder="16 Digit NIK" className="border-slate-200 font-mono" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="birthDate" className="text-xs font-bold uppercase text-slate-500">Tanggal Lahir</Label>
                                   <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className="border-slate-200" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="gender" className="text-xs font-bold uppercase text-slate-500">Jenis Kelamin</Label>
                                   <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                                        <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="L">Laki-laki</SelectItem>
                                             <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500">No. WhatsApp/Telepon</Label>
                                   <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="08xxxxxxxxxxx" className="border-slate-200" />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="bpjsNo" className="text-xs font-bold uppercase text-slate-500">No. BPJS (Opsional)</Label>
                                   <Input id="bpjsNo" value={formData.bpjsNo} onChange={(e) => setFormData({...formData, bpjsNo: e.target.value})} placeholder="No. Kartu JKN" className="border-slate-200 font-mono" />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                   <Label htmlFor="address" className="text-xs font-bold uppercase text-slate-500">Alamat Lengkap</Label>
                                   <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Dusun, RT/RW, Kelurahan, Kecamatan" className="border-slate-200" />
                              </div>
                         </div>

                         <DialogFooter className="gap-2 sm:gap-0">
                              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-slate-500 font-bold">Batal</Button>
                              <Button onClick={handleSubmit} disabled={submitting} className="bg-[#125eab] hover:bg-blue-700 min-w-[150px] shadow-lg shadow-blue-200">
                                   {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                   Daftarkan Pasien
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>

               {/* DETAIL MODAL */}
               <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="max-w-3xl bg-white border-none shadow-2xl p-0 overflow-hidden">
                         {selectedPatient && (
                              <>
                                   <div className="bg-[#125eab] p-8 text-white">
                                        <div className="flex justify-between items-start">
                                             <div className="flex gap-6 items-center">
                                                  <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center text-3xl font-bold border border-white/30 shadow-xl">
                                                       {selectedPatient.gender}
                                                  </div>
                                                  <div>
                                                       <h2 className="text-3xl font-bold tracking-tight">{selectedPatient.name}</h2>
                                                       <div className="flex gap-3 mt-2">
                                                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                                                                 {selectedPatient.registrationNo}
                                                            </span>
                                                            <span className="bg-green-400/30 px-3 py-1 rounded-full text-xs font-bold border border-green-400/50">
                                                                 Pasien Aktif
                                                            </span>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className="text-right">
                                                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Usia Pasien</p>
                                                  <p className="text-3xl font-light">{getAge(selectedPatient.birthDate)} <span className="text-sm font-bold uppercase opacity-60 ml-1">Tahun</span></p>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="p-8 grid grid-cols-3 gap-8 bg-slate-50/50">
                                        <div className="col-span-2 space-y-8">
                                             <div className="grid grid-cols-2 gap-6">
                                                  <div className="space-y-1">
                                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identitas NIK</p>
                                                       <p className="font-mono text-slate-700 font-bold">{selectedPatient.nik || "Tidak ada data"}</p>
                                                  </div>
                                                  <div className="space-y-1">
                                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No. BPJS / JKN</p>
                                                       <p className="font-mono text-slate-700 font-bold">{selectedPatient.bpjsNo || "Tidak ada data"}</p>
                                                  </div>
                                                  <div className="space-y-1">
                                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal Lahir</p>
                                                       <p className="text-slate-700 font-bold">
                                                            {new Date(selectedPatient.birthDate).toLocaleDateString('id-ID', {
                                                                 day: '2-digit',
                                                                 month: 'long',
                                                                 year: 'numeric'
                                                            })}
                                                       </p>
                                                  </div>
                                                  <div className="space-y-1">
                                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kontak</p>
                                                       <p className="text-slate-700 font-bold">{selectedPatient.phone || "Tidak ada kontak"}</p>
                                                  </div>
                                             </div>

                                             <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat Lengkap</p>
                                                  <p className="text-slate-600 leading-relaxed font-medium">{selectedPatient.address || "Belum ada data alamat"}</p>
                                             </div>
                                        </div>

                                        <div className="space-y-6 border-l pl-8 border-slate-200">
                                             <div>
                                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Statistik Kunjungan</p>
                                                  <div className="space-y-3">
                                                       <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
                                                            <span className="text-xs text-slate-500">Total Kunjungan</span>
                                                            <span className="text-lg font-bold text-[#125eab]">0</span>
                                                       </div>
                                                       <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
                                                            <span className="text-xs text-slate-500">Resep Terakhir</span>
                                                            <span className="text-xs font-bold text-slate-700">-</span>
                                                       </div>
                                                  </div>
                                             </div>
                                             <Button className="w-full bg-slate-800 hover:bg-black transition-all">
                                                  Buka Rekam Medis
                                             </Button>
                                        </div>
                                   </div>
                                   
                                   <div className="p-4 bg-slate-100/50 flex justify-end">
                                        <Button variant="ghost" className="text-slate-400 font-bold h-8 text-xs hover:text-red-500" onClick={() => setIsDetailModalOpen(false)}>
                                             Tutup Detail
                                        </Button>
                                   </div>
                              </>
                         )}
                    </DialogContent>
               </Dialog>
          </div>
     );
}

