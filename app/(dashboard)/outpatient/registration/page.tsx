"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
     const router = useRouter();
     const [patients, setPatients] = useState<any[]>([]);
     const [doctors, setDoctors] = useState<any[]>([]);
     const [polyclinics, setPolyclinics] = useState<any[]>([]);
     const [loading, setLoading] = useState(true);
     const [submitting, setSubmitting] = useState(false);

     const [formData, setFormData] = useState({
          patientId: "",
          doctorId: "",
          polyclinicId: "",
          appointmentDate: new Date().toISOString().split('T')[0],
          notes: "",
          source: "Offline",
          paymentMethod: "Umum"
     });

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const [pRes, dRes, polyRes] = await Promise.all([
                         fetch("/api/patients"),
                         fetch("/api/doctors"),
                         fetch("/api/polyclinics")
                    ]);
                    setPatients(await pRes.json());
                    setDoctors(await dRes.json());
                    setPolyclinics(await polyRes.json());
               } catch (error) {
                    console.error("Failed to fetch data:", error);
               } finally {
                    setLoading(false);
               }
          };
          fetchData();
     }, []);

     const handleReset = () => {
          setFormData({
               patientId: "",
               doctorId: "",
               polyclinicId: "",
               appointmentDate: new Date().toISOString().split('T')[0],
               notes: "",
               source: "Offline",
               paymentMethod: "Umum"
          });
     };

     const handleSubmit = async () => {
          if (!formData.patientId || !formData.doctorId || !formData.polyclinicId) {
               alert("Mohon pilih Pasien, Poliklinik, dan Dokter.");
               return;
          }

          setSubmitting(true);
          try {
               const response = await fetch("/api/appointments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
               });

               if (response.ok) {
                    alert("Pendaftaran berhasil!");
                    router.push("/dashboard");
               } else {
                    const err = await response.json();
                    alert(`Gagal: ${err.error || "Terjadi kesalahan"}`);
               }
          } catch (error) {
               console.error("Submit error:", error);
               alert("Terjadi kesalahan sistem.");
          } finally {
               setSubmitting(false);
          }
     };

     if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

     return (
          <div className="space-y-6 max-w-4xl mx-auto">
               <div>
                    <h1 className="text-2xl font-bold text-slate-800">Registrasi Kunjungan Pasien</h1>
                    <p className="text-slate-500">Daftarkan pasien untuk pemeriksaan rawat jalan.</p>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>Pilih Pasien & Tujuan Kunjungan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2 md:col-span-2">
                                   <Label>Pasien</Label>
                                   <Select value={formData.patientId} onValueChange={(v) => setFormData({...formData, patientId: v})}>
                                        <SelectTrigger>
                                             <SelectValue placeholder="Cari/Pilih Pasien yang sudah terdaftar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {patients.map(p => (
                                                  <SelectItem key={p.id} value={String(p.id)}>{p.registrationNo} - {p.name}</SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                                   <p className="text-xs text-slate-400">Jika pasien belum terdaftar, silakan <Link href="/patients" className="text-blue-600 hover:underline">tambah pasien baru</Link> terlebih dahulu.</p>
                              </div>

                              <div className="space-y-2">
                                   <Label>Poliklinik Tujuan</Label>
                                   <Select value={formData.polyclinicId} onValueChange={(v) => setFormData({...formData, polyclinicId: v})}>
                                        <SelectTrigger><SelectValue placeholder="Pilih Poli..." /></SelectTrigger>
                                        <SelectContent>
                                             {polyclinics.map(p => (
                                                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>

                              <div className="space-y-2">
                                   <Label>Dokter</Label>
                                   <Select value={formData.doctorId} onValueChange={(v) => setFormData({...formData, doctorId: v})}>
                                        <SelectTrigger><SelectValue placeholder="Pilih Dokter..." /></SelectTrigger>
                                        <SelectContent>
                                             {doctors.map(d => (
                                                  <SelectItem key={d.id} value={String(d.id)}>{d.name} ({d.specialization})</SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>

                              <div className="space-y-2">
                                   <Label>Tanggal Kunjungan</Label>
                                   <Input type="date" value={formData.appointmentDate} onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} />
                              </div>

                              <div className="space-y-2">
                                   <Label>Cara Bayar</Label>
                                   <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({...formData, paymentMethod: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Umum">Umum / Tunai</SelectItem>
                                             <SelectItem value="BPJS">BPJS Kesehatan</SelectItem>
                                             <SelectItem value="Asuransi">Asuransi Lain</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                         </div>

                         <div className="space-y-2">
                              <Label>Catatan / Keluhan Singkat</Label>
                              <Textarea placeholder="Keluhan utama pasien..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                         </div>

                         <div className="flex justify-end gap-4 pt-4">
                              <Button variant="outline" onClick={handleReset}>Reset</Button>
                              <Button onClick={handleSubmit} disabled={submitting} className="bg-[#125eab] hover:bg-blue-700 min-w-[150px]">
                                   {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                   Daftarkan Pasien
                              </Button>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}

// Helper Link component since it might not be imported from next/link top level in this file yet
import Link from "next/link";
