"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Save } from "lucide-react";

export default function AccountSettingsPage() {
     return (
          <div className="space-y-6">
               <div>
                    <h3 className="text-lg font-medium">Pengaturan Akun</h3>
                    <p className="text-sm text-muted-foreground">
                         Kelola preferensi akun dan keamanan Anda.
                    </p>
               </div>

               <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <User className="w-5 h-5 text-[#125eab]" />
                                   Profil Pengguna
                              </CardTitle>
                              <CardDescription>Update informasi profil Anda.</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="grid gap-2">
                                   <Label htmlFor="name">Nama Lengkap</Label>
                                   <Input id="name" defaultValue="Administrator" />
                              </div>
                              <div className="grid gap-2">
                                   <Label htmlFor="email">Email</Label>
                                   <Input id="email" type="email" defaultValue="admin@primahusada.com" />
                              </div>
                              <div className="grid gap-2">
                                   <Label htmlFor="role">Role</Label>
                                   <Input id="role" defaultValue="Super Admin" disabled className="bg-slate-50" />
                              </div>
                         </CardContent>
                         <CardFooter>
                              <Button className="bg-[#125eab] hover:bg-blue-700 w-full md:w-auto">Simpan Profil</Button>
                         </CardFooter>
                    </Card>

                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <Lock className="w-5 h-5 text-[#125eab]" />
                                   Keamanan
                              </CardTitle>
                              <CardDescription>Ubah kata sandi akun Anda.</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="grid gap-2">
                                   <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                                   <Input id="current-password" type="password" />
                              </div>
                              <div className="grid gap-2">
                                   <Label htmlFor="new-password">Kata Sandi Baru</Label>
                                   <Input id="new-password" type="password" />
                              </div>
                              <div className="grid gap-2">
                                   <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
                                   <Input id="confirm-password" type="password" />
                              </div>
                         </CardContent>
                         <CardFooter>
                              <Button variant="outline" className="w-full md:w-auto">Ubah Kata Sandi</Button>
                         </CardFooter>
                    </Card>
               </div>
          </div>
     );
}
