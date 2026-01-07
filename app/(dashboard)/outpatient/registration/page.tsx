"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function RegistrationPage() {
     return (
          <div className="space-y-6 max-w-4xl mx-auto">
               <div>
                    <h1 className="text-2xl font-bold text-slate-800">Registrasi Pasien Baru</h1>
                    <p className="text-slate-500">Formulir pendaftaran pasien rawat jalan.</p>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>Data Pribadi Pasien</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                   <Label>NIK (KTP)</Label>
                                   <Input placeholder="320xxxxxxxxxxxxx" />
                              </div>
                              <div className="space-y-2">
                                   <Label>No. BPJS (Opsional)</Label>
                                   <Input placeholder="00xxxxxxxxxxxxx" />
                              </div>

                              <div className="space-y-2">
                                   <Label>Nama Lengkap</Label>
                                   <Input placeholder="Sesuai KTP" />
                              </div>
                              <div className="space-y-2">
                                   <Label>Jenis Kelamin</Label>
                                   <Select>
                                        <SelectTrigger>
                                             <SelectValue placeholder="Pilih..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="L">Laki-Laki</SelectItem>
                                             <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>

                              <div className="space-y-2">
                                   <Label>Tempat & Tanggal Lahir</Label>
                                   <div className="flex gap-2">
                                        <Input placeholder="Tempat Lahir" className="flex-1" />
                                        <Input type="date" className="w-40" />
                                   </div>
                              </div>

                              <div className="space-y-2">
                                   <Label>No. Telepon / WA</Label>
                                   <Input placeholder="08xxxxxxxxxxx" />
                              </div>
                         </div>

                         <div className="space-y-2">
                              <Label>Alamat Lengkap</Label>
                              <Textarea placeholder="Jl..." />
                         </div>

                         <div className="border-t pt-6">
                              <h3 className="text-lg font-medium mb-4">Tujuan Kunjungan</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                        <Label>Poliklinik Tujuan</Label>
                                        <Select>
                                             <SelectTrigger>
                                                  <SelectValue placeholder="Pilih Poli..." />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  <SelectItem value="umum">Poli Umum</SelectItem>
                                                  <SelectItem value="gigi">Poli Gigi</SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>
                                   <div className="space-y-2">
                                        <Label>Dokter</Label>
                                        <Select>
                                             <SelectTrigger>
                                                  <SelectValue placeholder="Pilih Dokter..." />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  <SelectItem value="andi">dr. Andi Wijaya</SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>
                                   <div className="space-y-2">
                                        <Label>Cara Bayar</Label>
                                        <Select>
                                             <SelectTrigger>
                                                  <SelectValue placeholder="Pilih..." />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  <SelectItem value="umum">Umum / Tunai</SelectItem>
                                                  <SelectItem value="bpjs">BPJS Kesehatan</SelectItem>
                                                  <SelectItem value="asuransi">Asuransi Lain</SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>
                              </div>
                         </div>

                         <div className="flex justify-end gap-4 pt-4">
                              <Button variant="outline">Reset</Button>
                              <Button className="bg-[#125eab] hover:bg-blue-700 min-w-[150px]">
                                   Daftarkan Pasien
                              </Button>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
