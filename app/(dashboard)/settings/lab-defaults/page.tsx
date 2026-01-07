"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function LabDefaultsSettingsPage() {
     return (
          <div className="space-y-6">
               <div>
                    <h3 className="text-lg font-medium">Default Laboratorium</h3>
                    <p className="text-sm text-muted-foreground">
                         Konfigurasi nilai rujukan dan template hasil lab.
                    </p>
               </div>

               <Tabs defaultValue="hematologi" className="w-full">
                    <TabsList className="mb-4">
                         <TabsTrigger value="hematologi">Hematologi</TabsTrigger>
                         <TabsTrigger value="kimia">Kimia Darah</TabsTrigger>
                         <TabsTrigger value="urin">Urinalisa</TabsTrigger>
                         <TabsTrigger value="template">Template Surat</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hematologi">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Nilai Rujukan Hematologi</CardTitle>
                                   <CardDescription>Setup nilai normal untuk pemeriksaan darah lengkap.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-b pb-4">
                                        <div className="space-y-2">
                                             <Label>Parameter</Label>
                                             <Input defaultValue="Hemoglobin (Hb)" readOnly className="bg-slate-50" />
                                        </div>
                                        <div className="space-y-2">
                                             <Label>Nilai Normal Pria</Label>
                                             <div className="flex items-center gap-2">
                                                  <Input defaultValue="13.0" className="w-20" />
                                                  <span>-</span>
                                                  <Input defaultValue="18.0" className="w-20" />
                                                  <span className="text-sm text-muted-foreground">g/dL</span>
                                             </div>
                                        </div>
                                        <div className="space-y-2">
                                             <Label>Nilai Normal Wanita</Label>
                                             <div className="flex items-center gap-2">
                                                  <Input defaultValue="12.0" className="w-20" />
                                                  <span>-</span>
                                                  <Input defaultValue="16.0" className="w-20" />
                                                  <span className="text-sm text-muted-foreground">g/dL</span>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-b pb-4">
                                        <div className="space-y-2">
                                             <Label>Parameter</Label>
                                             <Input defaultValue="Leukosit" readOnly className="bg-slate-50" />
                                        </div>
                                        <div className="space-y-2">
                                             <Label>Nilai Normal</Label>
                                             <div className="flex items-center gap-2">
                                                  <Input defaultValue="4000" className="w-24" />
                                                  <span>-</span>
                                                  <Input defaultValue="11000" className="w-24" />
                                                  <span className="text-sm text-muted-foreground">/µL</span>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="flex justify-end">
                                        <Button className="bg-[#125eab]">Simpan Nilai Rujukan</Button>
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="template">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Template Kop Surat Lab</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="flex items-center space-x-2">
                                        <Switch id="show-logo" defaultChecked />
                                        <Label htmlFor="show-logo">Tampilkan Logo Klinik</Label>
                                   </div>
                                   <div className="flex items-center space-x-2">
                                        <Switch id="show-sig" defaultChecked />
                                        <Label htmlFor="show-sig">Tampilkan Tanda Tangan Dokter Penanggung Jawab</Label>
                                   </div>
                                   <div className="pt-4">
                                        <Label>Catatan Kaki Default</Label>
                                        <Input defaultValue="Hasil pemeriksaan harap dikonsultasikan kembali dengan dokter pemeriksa." />
                                   </div>
                                   <div className="flex justify-end pt-4">
                                        <Button className="bg-[#125eab]">Simpan Template</Button>
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>
               </Tabs>
          </div>
     );
}
