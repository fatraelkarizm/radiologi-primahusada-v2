"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
     Search, 
     FileText, 
     User, 
     Calendar, 
     Stethoscope, 
     Activity,
     Loader2,
     ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MedicalRecordsPage() {
     const [records, setRecords] = useState<any[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");

     const fetchRecords = async () => {
          setLoading(true);
          try {
               const res = await fetch("/api/medical-records");
               if (res.ok) {
                    const data = await res.json();
                    setRecords(data);
               }
          } catch (e) {
               console.error("Failed to fetch medical records:", e);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchRecords();
     }, []);

     const filteredRecords = records.filter(record => 
          record.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
     );

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-3xl font-bold text-[#125eab]">Rekam Medis</h1>
                    <p className="text-slate-500">Arsip riwayat kunjungan dan diagnosa pasien.</p>
               </div>

               <Card className="border-none shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                         <div className="p-4 bg-slate-50 border-b flex items-center gap-4">
                              <div className="relative flex-1 max-w-sm">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                   <Input 
                                        placeholder="Cari pasien, diagnosa, atau dokter..." 
                                        className="pl-10 bg-white border-slate-200" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                   <FileText className="w-4 h-4" />
                                   <span>Total: {records.length} Record</span>
                              </div>
                         </div>

                         <div className="overflow-x-auto">
                              <Table>
                                   <TableHeader className="bg-slate-50/50">
                                        <TableRow>
                                             <TableHead className="font-semibold px-6">Tanggal Kunjungan</TableHead>
                                             <TableHead className="font-semibold">Pasien</TableHead>
                                             <TableHead className="font-semibold">Dokter</TableHead>
                                             <TableHead className="font-semibold">Diagnosa Utama</TableHead>
                                             <TableHead className="font-semibold">Tindakan</TableHead>
                                             <TableHead className="text-right font-semibold px-6">Aksi</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {loading ? (
                                             <TableRow>
                                                  <TableCell colSpan={6} className="text-center py-12">
                                                       <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#125eab] opacity-50" />
                                                       <p className="mt-2 text-slate-400">Memuat rekam medis...</p>
                                                  </TableCell>
                                             </TableRow>
                                        ) : filteredRecords.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={6} className="text-center py-12">
                                                       <div className="flex flex-col items-center gap-2 text-slate-400">
                                                            <Activity className="w-10 h-10 opacity-20" />
                                                            <p>Tidak ada rekam medis ditemukan</p>
                                                       </div>
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             filteredRecords.map((record) => (
                                                  <TableRow key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                                                       <TableCell className="px-6">
                                                            <div className="flex items-center gap-2">
                                                                 <Calendar className="w-3 h-3 text-[#125eab]" />
                                                                 <span className="text-sm font-medium">
                                                                      {new Date(record.visitDate).toLocaleDateString('id-ID', {
                                                                           day: 'numeric',
                                                                           month: 'short',
                                                                           year: 'numeric'
                                                                      })}
                                                                 </span>
                                                            </div>
                                                       </TableCell>
                                                       <TableCell>
                                                            <div className="flex flex-col">
                                                                 <span className="font-bold text-slate-700">{record.patient.name}</span>
                                                                 <span className="text-[10px] text-slate-400 font-mono">RM: {record.patient.registrationNo}</span>
                                                            </div>
                                                       </TableCell>
                                                       <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                 <Stethoscope className="w-3 h-3 text-slate-400" />
                                                                 <span className="text-sm">{record.doctor.name}</span>
                                                            </div>
                                                       </TableCell>
                                                       <TableCell>
                                                            <div className="flex flex-col">
                                                                 <span className="text-sm font-medium text-[#125eab]">{record.diagnosis || "-"}</span>
                                                                 <span className="text-[10px] text-slate-400">{record.icdCode && `ICD-10: ${record.icdCode}`}</span>
                                                            </div>
                                                       </TableCell>
                                                       <TableCell>
                                                            <span className="text-sm text-slate-600 line-clamp-1 max-w-[200px]">{record.treatment || "-"}</span>
                                                       </TableCell>
                                                       <TableCell className="text-right px-6">
                                                            <Button variant="ghost" size="sm" className="text-[#125eab] font-bold hover:bg-blue-50 group-hover:px-4 transition-all">
                                                                 Detail <ChevronRight className="w-4 h-4 ml-1" />
                                                            </Button>
                                                       </TableCell>
                                                  </TableRow>
                                             ))
                                        )}
                                   </TableBody>
                              </Table>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
