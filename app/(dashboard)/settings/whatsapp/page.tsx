"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Phone, CheckCircle2, AlertCircle } from "lucide-react";

export default function WhatsappSettingsPage() {
     return (
          <div className="space-y-6">
               <div>
                    <h3 className="text-lg font-medium">Whatsapp Broadcast</h3>
                    <p className="text-sm text-muted-foreground">
                         Konfigurasi integrasi Whatsapp Gateway untuk notifikasi pasien.
                    </p>
               </div>

               <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                   <span>Status Koneksi</span>
                                   <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 flex gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Terhubung
                                   </Badge>
                              </CardTitle>
                              <CardDescription>
                                   Device ID: my-clinic-wa-01
                              </CardDescription>
                         </CardHeader>
                         <CardContent className="flex flex-col items-center justify-center py-6">
                              <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                   <Phone className="w-10 h-10 text-[#125eab]" />
                              </div>
                              <p className="text-center font-medium">0812-3456-7890</p>
                              <p className="text-center text-sm text-slate-500">Whatsapp Business API</p>
                         </CardContent>
                         <CardFooter className="flex gap-2">
                              <Button variant="destructive" className="flex-1">Putus Koneksi</Button>
                              <Button variant="outline" className="flex-1">Scan QR Ulang</Button>
                         </CardFooter>
                    </Card>

                    <Card>
                         <CardHeader>
                              <CardTitle>Pengaturan Pesan</CardTitle>
                              <CardDescription>Template pesan otomatis.</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="space-y-2">
                                   <Label>API Key (Fonnte/Wablas/Other)</Label>
                                   <Input type="password" value="************************" />
                              </div>
                              <div>
                                   <Label className="mb-2 block">Template Reminder Booking</Label>
                                   <div className="p-3 bg-slate-50 border rounded-md text-sm text-slate-600 italic">
                                        "Halo {'{nama_pasien}'}, mengingatkan jadwal konsultasi Anda dengan {'{nama_dokter}'} pada {'{tanggal}'} pukul {'{jam}'}. Mohon hadir 15 menit sebelumnya. Terima kasih - Klinik Prima Husada"
                                   </div>
                                   <div className="flex justify-end mt-2">
                                        <Button variant="link" className="text-[#125eab] h-auto p-0 text-xs">Edit Template</Button>
                                   </div>
                              </div>
                         </CardContent>
                         <CardFooter>
                              <Button className="w-full bg-[#125eab]">Test Kirim Pesan</Button>
                         </CardFooter>
                    </Card>
               </div>
          </div>
     );
}
