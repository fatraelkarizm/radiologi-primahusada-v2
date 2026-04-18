"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useReactToPrint } from "react-to-print";
import { PrintLayout } from "@/components/PrintLayout";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Printer, Edit, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { XRayExamination, Patient, Doctor } from "@prisma/client";

// Extended type for frontend view with relations
type XRayView = XRayExamination & {
     patient?: Patient;
     doctor?: Doctor;
};

export default function XRayExaminationsPage() {
     const { status } = useSession();
     const router = useRouter();
     const isAuthenticated = status === "authenticated";

     // State Management
     const [xrayData, setXrayData] = useState<XRayView[]>([]);
     const [patients, setPatients] = useState<Patient[]>([]);
     const [doctors, setDoctors] = useState<Doctor[]>([]);
     const [loading, setLoading] = useState(true);

     // Filter states
     const [searchTerm, setSearchTerm] = useState("");

     // Modal states
     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
     const [xrayToDelete, setXrayToDelete] = useState<XRayView | null>(null);
     const [editingXray, setEditingXray] = useState<XRayView | null>(null);
     const [submitting, setSubmitting] = useState(false);

     // Print states
     const [xrayToPrint, setXrayToPrint] = useState<XRayView | null>(null);
     const printXrayComponentRef = useRef<HTMLDivElement>(null);

     // Form data
     const [formData, setFormData] = useState({
          patientId: "",
          doctorId: "",
          examinationType: "",
          examinationDate: new Date().toISOString().split('T')[0],
          status: "Menunggu",
          notes: "",
     });

     // Print functionality
     const handleXrayPrint = useReactToPrint({
          contentRef: printXrayComponentRef,
          onAfterPrint: () => setXrayToPrint(null),
     });

     const triggerXrayPrint = (xray: XRayView) => {
          setXrayToPrint(xray);
     };

     useEffect(() => {
          if (xrayToPrint) {
               handleXrayPrint();
          }
     }, [xrayToPrint, handleXrayPrint]);

     // Auth Check
     useEffect(() => {
          if (status === "unauthenticated") {
               router.push("/login");
          }
     }, [status, router]);

     // Fetch functions
     const fetchData = async () => {
          setLoading(true);
          try {
               const [xrayRes, patientsRes, doctorsRes] = await Promise.all([
                    fetch("/api/xray"),
                    fetch("/api/patients"),
                    fetch("/api/doctors")
               ]);
               
               if (xrayRes.ok) setXrayData(await xrayRes.json());
               if (patientsRes.ok) setPatients(await patientsRes.json());
               if (doctorsRes.ok) setDoctors(await doctorsRes.json());
          } catch (error) {
               console.error("Fetch data error:", error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (isAuthenticated) {
               fetchData();
          }
     }, [isAuthenticated]);

     // CRUD Operations
     const handleSubmit = async () => {
          if (!formData.patientId || !formData.examinationType) {
               alert("Pasien dan jenis pemeriksaan wajib diisi!");
               return;
          }

          setSubmitting(true);
          try {
               const response = await fetch("/api/xray", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
               });

               if (response.ok) {
                    setIsAddModalOpen(false);
                    fetchData();
               } else {
                    const err = await response.json();
                    throw new Error(err.error || "Gagal menyimpan data");
               }
          } catch (error: any) {
               console.error("Error:", error);
               alert(error.message);
          } finally {
               setSubmitting(false);
          }
     };

     const handleUpdate = async () => {
          if (!editingXray) return;

          setSubmitting(true);
          try {
               const response = await fetch(`/api/xray/${editingXray.id}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
               });

               if (response.ok) {
                    setIsEditModalOpen(false);
                    setEditingXray(null);
                    fetchData();
               } else {
                    const err = await response.json();
                    throw new Error(err.error || "Gagal mengupdate data");
               }
          } catch (error: any) {
               console.error("Error:", error);
               alert(error.message);
          } finally {
               setSubmitting(false);
          }
     };

     const handleDelete = async () => {
          if (!xrayToDelete) return;

          setSubmitting(true);
          try {
               const response = await fetch(`/api/xray/${xrayToDelete.id}`, {
                    method: "DELETE",
               });

               if (response.ok) {
                    setIsDeleteModalOpen(false);
                    setXrayToDelete(null);
                    fetchData();
               } else {
                    const err = await response.json();
                    throw new Error(err.error || "Gagal menghapus data");
               }
          } catch (error: any) {
               console.error("Error:", error);
               alert(error.message);
          } finally {
               setSubmitting(false);
          }
     };

     const openAddModal = () => {
          setFormData({
               patientId: "",
               doctorId: "",
               examinationType: "",
               examinationDate: new Date().toISOString().split('T')[0],
               status: "Menunggu",
               notes: "",
          });
          setIsAddModalOpen(true);
     };

     const openEditModal = (xray: XRayView) => {
          setEditingXray(xray);
          setFormData({
               patientId: String(xray.patientId),
               doctorId: xray.doctorId ? String(xray.doctorId) : "",
               examinationType: xray.examinationType,
               examinationDate: new Date(xray.examinationDate).toISOString().split('T')[0],
               status: xray.status,
               notes: xray.notes || "",
          });
          setIsEditModalOpen(true);
     };

     const filteredXrays = xrayData.filter((xray) => {
          const patientName = xray.patient?.name || "";
          return (
               patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               xray.examinationType.toLowerCase().includes(searchTerm.toLowerCase())
          );
     });

     const getStatusColor = (status: string) => {
          switch (status) {
               case "Selesai": return "bg-green-100 text-green-800 border-green-200";
               case "Dalam Proses": return "bg-yellow-100 text-yellow-800 border-yellow-200";
               case "Menunggu": return "bg-blue-100 text-blue-800 border-blue-200";
               default: return "bg-gray-100 text-gray-800 border-gray-200";
          }
     };

     if (status === "loading") return <div className="p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
     if (!isAuthenticated) return null;

     return (
          <div className="space-y-6">
               <div style={{ display: "none" }}>
                    {xrayToPrint && (
                         <div ref={printXrayComponentRef}>
                              <PrintLayout
                                   xrayData={{
                                        ...xrayToPrint,
                                        patient_id: xrayToPrint.patientId,
                                        examination_type: xrayToPrint.examinationType,
                                        examination_date: xrayToPrint.examinationDate.toString(),
                                        doctor_id: xrayToPrint.doctorId,
                                   }}
                                   patient={xrayToPrint.patient ? {
                                        ...xrayToPrint.patient,
                                        age: 0, // Mock age if not in Prisma but needed by PrintLayout
                                   } : undefined}
                                   doctor={xrayToPrint.doctor}
                              />
                         </div>
                    )}
               </div>

               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-3xl font-bold">Bagian Rontgen</h1>
                         <p className="text-muted-foreground">Kelola pemeriksaan radiologi.</p>
                    </div>
                    <Button onClick={openAddModal}>
                         <Plus className="w-4 h-4 mr-2" /> Tambah Pemeriksaan
                    </Button>
               </div>

               <Card>
                    <CardContent className="pt-6">
                         <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input 
                                   placeholder="Cari nama pasien atau jenis pemeriksaan..." 
                                   value={searchTerm} 
                                   onChange={(e) => setSearchTerm(e.target.value)} 
                                   className="pl-10" 
                              />
                         </div>
                    </CardContent>
               </Card>

               <Card>
                    <CardContent className="p-0">
                         <div className="rounded-md border">
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead className="pl-4">ID</TableHead>
                                             <TableHead>Pasien</TableHead>
                                             <TableHead>Jenis Pemeriksaan</TableHead>
                                             <TableHead>Tanggal</TableHead>
                                             <TableHead>Status</TableHead>
                                             <TableHead className="text-right pr-4">Aksi</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {loading ? (
                                             <TableRow>
                                                  <TableCell colSpan={6} className="text-center py-8">
                                                       <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                                  </TableCell>
                                             </TableRow>
                                        ) : filteredXrays.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                       Tidak ada data pemeriksaan.
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             filteredXrays.map((xray) => (
                                                  <TableRow key={xray.id}>
                                                       <TableCell className="pl-4 font-mono text-xs">XR{String(xray.id).padStart(3, "0")}</TableCell>
                                                       <TableCell className="font-medium">{xray.patient?.name}</TableCell>
                                                       <TableCell>{xray.examinationType}</TableCell>
                                                       <TableCell>{new Date(xray.examinationDate).toLocaleDateString("id-ID")}</TableCell>
                                                       <TableCell><Badge variant="outline" className={getStatusColor(xray.status)}>{xray.status}</Badge></TableCell>
                                                       <TableCell className="text-right pr-4 space-x-1">
                                                            <Button variant="ghost" size="icon" onClick={() => triggerXrayPrint(xray)}><Printer className="w-4 h-4" /></Button>
                                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(xray)}><Edit className="w-4 h-4" /></Button>
                                                            <Button variant="ghost" size="icon" onClick={() => { setXrayToDelete(xray); setIsDeleteModalOpen(true); }} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                                       </TableCell>
                                                  </TableRow>
                                             ))
                                        )}
                                   </TableBody>
                              </Table>
                         </div>
                    </CardContent>
               </Card>

               {/* Add/Edit Modal */}
               <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(v) => { if(!v) { setIsAddModalOpen(false); setIsEditModalOpen(false); } }}>
                    <DialogContent className="max-w-2xl">
                         <DialogHeader>
                              <DialogTitle>{isEditModalOpen ? "Edit Pemeriksaan" : "Tambah Pemeriksaan"}</DialogTitle>
                              <DialogDescription>Input data pemeriksaan radiologi pasien.</DialogDescription>
                         </DialogHeader>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                              <div className="space-y-2">
                                   <Label htmlFor="patientId">Pasien</Label>
                                   <Select 
                                        disabled={isEditModalOpen}
                                        value={formData.patientId} 
                                        onValueChange={(val) => setFormData({ ...formData, patientId: val })}
                                   >
                                        <SelectTrigger id="patientId"><SelectValue placeholder="Pilih Pasien" /></SelectTrigger>
                                        <SelectContent>
                                             {patients.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="examinationType">Jenis Pemeriksaan</Label>
                                   <Select value={formData.examinationType} onValueChange={(val) => setFormData({ ...formData, examinationType: val })}>
                                        <SelectTrigger id="examinationType"><SelectValue placeholder="Pilih Jenis" /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Rontgen Dada">Rontgen Dada</SelectItem>
                                             <SelectItem value="CT Scan">CT Scan</SelectItem>
                                             <SelectItem value="MRI">MRI</SelectItem>
                                             <SelectItem value="USG">USG</SelectItem>
                                             <SelectItem value="Rontgen Ekstremitas">Rontgen Ekstremitas</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="doctorId">Dokter Pengirim</Label>
                                   <Select value={formData.doctorId} onValueChange={(val) => setFormData({ ...formData, doctorId: val })}>
                                        <SelectTrigger id="doctorId"><SelectValue placeholder="Pilih Dokter" /></SelectTrigger>
                                        <SelectContent>
                                             {doctors.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="examinationDate">Tanggal Pemeriksaan</Label>
                                   <Input id="examinationDate" type="date" value={formData.examinationDate} onChange={(e) => setFormData({ ...formData, examinationDate: e.target.value })} />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="status">Status</Label>
                                   <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Menunggu">Menunggu</SelectItem>
                                             <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                                             <SelectItem value="Selesai">Selesai</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                   <Label htmlFor="notes">Catatan / Hasil Sementara</Label>
                                   <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Masukkan hasil pemeriksaan..." />
                              </div>
                         </div>

                         <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Batal</Button>
                              <Button onClick={isEditModalOpen ? handleUpdate : handleSubmit} disabled={submitting}>
                                   {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                   Simpan
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>

               {/* Delete Confirm */}
               <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Hapus Pemeriksaan</DialogTitle>
                              <DialogDescription>Apakah Anda yakin ingin menghapus data pemeriksaan ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
                         </DialogHeader>
                         <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
                              <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                                   {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                   Hapus
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>
          </div>
     );
}
