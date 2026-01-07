"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export default function ManageDoctorSchedulePage() {
     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-2xl font-bold text-slate-800">Kelola Jadwal Dokter</h1>
                         <p className="text-slate-500">Atur jadwal praktek dokter per hari.</p>
                    </div>
                    <Button className="bg-[#125eab] hover:bg-blue-700">
                         Simpan Jadwal
                    </Button>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>Form Jadwal Praktek</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                   <Label>Pilih Dokter</Label>
                                   <Select>
                                        <SelectTrigger>
                                             <SelectValue placeholder="Pilih nama dokter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="dr-andi">dr. Andi Wijaya</SelectItem>
                                             <SelectItem value="dr-budi">dr. Budi Santoso</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>

                              <div className="space-y-2">
                                   <Label>Poli</Label>
                                   <Input value="Poli Umum" readOnly className="bg-slate-50" />
                              </div>
                         </div>

                         <div className="space-y-4">
                              <Label>Jadwal Mingguan</Label>
                              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
                                   <div key={day} className="flex items-center gap-4 p-3 border rounded-md bg-slate-50/50">
                                        <div className="w-24 font-medium">{day}</div>
                                        <div className="flex items-center gap-2 flex-1">
                                             <Input type="time" className="w-32" />
                                             <span>s/d</span>
                                             <Input type="time" className="w-32" />
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                             <Trash2 className="w-4 h-4" />
                                        </Button>
                                   </div>
                              ))}
                              <Button variant="outline" className="w-full border-dashed">
                                   <Plus className="w-4 h-4 mr-2" /> Tambah Hari Lain
                              </Button>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
