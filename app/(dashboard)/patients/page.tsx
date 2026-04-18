"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2 } from "lucide-react";
import { Patient } from "@prisma/client";

export default function PatientsPage() {
     const [patients, setPatients] = useState<Patient[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");

     useEffect(() => {
          fetchPatients();
     }, []);

     const fetchPatients = async () => {
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

     const filteredPatients = patients.filter(patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.registrationNo.toLowerCase().includes(searchTerm.toLowerCase())
     );

     const getAge = (birthDate: Date) => {
          const today = new Date();
          const birth = new Date(birthDate);
          let age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
               age--;
          }
          return age;
     };

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Pasien</h1>
                    <Button>
                         <Plus className="w-4 h-4 mr-2" /> Tambah Pasien
                    </Button>
               </div>

               <Card>
                    <CardContent className="pt-6">
                         <div className="flex items-center gap-4 mb-6">
                              <div className="relative flex-1">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                   <Input 
                                        placeholder="Cari nama pasien atau No. RM..." 
                                        className="pl-10" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                              </div>
                         </div>

                         <div className="rounded-md border">
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>No. RM</TableHead>
                                             <TableHead>Nama Pasien</TableHead>
                                             <TableHead>Gender</TableHead>
                                             <TableHead>Usia</TableHead>
                                             <TableHead>No. Telepon</TableHead>
                                             <TableHead>Alamat</TableHead>
                                             <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {loading ? (
                                             <TableRow>
                                                  <TableCell colSpan={7} className="text-center py-8">
                                                       <div className="flex justify-center items-center gap-2">
                                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                            <span>Memuat data...</span>
                                                       </div>
                                                  </TableCell>
                                             </TableRow>
                                        ) : filteredPatients.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                       {searchTerm ? "Pasien tidak ditemukan." : "Belum ada data pasien."}
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             filteredPatients.map((patient) => (
                                                  <TableRow key={patient.id}>
                                                       <TableCell className="font-medium">{patient.registrationNo}</TableCell>
                                                       <TableCell>{patient.name}</TableCell>
                                                       <TableCell>{patient.gender}</TableCell>
                                                       <TableCell>{getAge(patient.birthDate)} th</TableCell>
                                                       <TableCell>{patient.phone}</TableCell>
                                                       <TableCell className="max-w-xs truncate">{patient.address}</TableCell>
                                                       <TableCell className="text-right">
                                                            <Button size="sm" variant="ghost">Detail</Button>
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
