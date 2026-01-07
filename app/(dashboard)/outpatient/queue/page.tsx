"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, PlayCircle, LogIn } from "lucide-react";

export default function QueuePage() {
     const queues = [
          { id: 1, poli: "Poli Umum", current: "A-005", waiting: 3, doctor: "dr. Andi Wijaya", status: "Sedang Memeriksa" },
          { id: 2, poli: "Poli Gigi", current: "B-002", waiting: 1, doctor: "dr. Budi Santoso", status: "Sedang Memeriksa" },
          { id: 3, poli: "Poli KIA", current: "C-001", waiting: 0, doctor: "dr. Siti Aminah", status: "Menunggu Dokter" },
     ];

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-2xl font-bold text-slate-800">Antrian Poliklinik</h1>
                         <p className="text-slate-500">Monitor antrian real-time.</p>
                    </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {queues.map((queue) => (
                         <Card key={queue.id} className="border-t-4 border-t-[#125eab] shadow-sm">
                              <CardContent className="p-6 text-center space-y-6">
                                   <div>
                                        <h3 className="font-medium text-slate-500">{queue.poli}</h3>
                                        <p className="text-sm font-medium mt-1">{queue.doctor}</p>
                                        <Badge variant="secondary" className="mt-2 bg-blue-50 text-[#125eab]">
                                             {queue.status}
                                        </Badge>
                                   </div>

                                   <div className="py-2">
                                        <div className="text-5xl font-bold text-slate-800 tracking-wider">
                                             {queue.current}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2 uppercase tracking-wide">Nomor Dipanggil</p>
                                   </div>

                                   <div className="flex justify-center gap-8 text-sm border-t pt-4">
                                        <div className="flex flex-col items-center">
                                             <span className="font-bold text-slate-700 text-lg">{queue.waiting}</span>
                                             <span className="text-slate-500 flex items-center gap-1">
                                                  <Users className="w-3 h-3" /> Menunggu
                                             </span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                             <span className="font-bold text-slate-700 text-lg">15</span>
                                             <span className="text-slate-500 flex items-center gap-1">
                                                  <Clock className="w-3 h-3" /> Estimasi (mnt)
                                             </span>
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-2 gap-3 pt-2">
                                        <Button className="w-full bg-[#125eab] hover:bg-blue-700">
                                             <PlayCircle className="w-4 h-4 mr-2" /> Panggil
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                             <LogIn className="w-4 h-4 mr-2" /> Masuk
                                        </Button>
                                   </div>
                              </CardContent>
                         </Card>
                    ))}
               </div>
          </div>
     );
}
