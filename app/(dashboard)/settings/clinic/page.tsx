"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ClinicSettingsPage() {
     return (
          <div className="space-y-6">
               <div>
                    <h3 className="text-lg font-medium">Pengaturan Klinik</h3>
                    <p className="text-sm text-muted-foreground">
                         Kelola informasi dasar tentang klinik Anda.
                    </p>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>Profil Klinik</CardTitle>
                         <CardDescription>
                              Informasi ini akan ditampilkan pada kop surat dan laporan.
                         </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid gap-2">
                              <Label htmlFor="name">Nama Klinik</Label>
                              <Input id="name" defaultValue="Klinik Prima Husada" />
                         </div>

                         <div className="grid gap-2">
                              <Label htmlFor="address">Alamat Lengkap</Label>
                              <Textarea
                                   id="address"
                                   defaultValue="Jl. Kesehatan No. 123, Jakarta Selatan, DKI Jakarta"
                                   className="min-h-[100px]"
                              />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                   <Label htmlFor="phone">Nomor Telepon</Label>
                                   <Input id="phone" defaultValue="021-55556789" />
                              </div>
                              <div className="grid gap-2">
                                   <Label htmlFor="email">Email</Label>
                                   <Input id="email" type="email" defaultValue="info@primahusada.com" />
                              </div>
                         </div>

                         <div className="grid gap-2">
                              <Label htmlFor="website">Website</Label>
                              <Input id="website" defaultValue="https://primahusada.com" />
                         </div>

                         <div className="flex justify-end pt-4">
                              <Button className="bg-[#125eab] hover:bg-blue-700">Simpan Perubahan</Button>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
