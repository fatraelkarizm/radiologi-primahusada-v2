"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar as CalendarIcon, Filter } from "lucide-react";

export default function BookingPage() {
     const bookings = [
          { id: "B-001", patient: "Budi Santoso", doctor: "dr. Andi Wijaya", poli: "Poli Umum", date: "2024-03-20", time: "09:00", status: "Terkonfirmasi" },
          { id: "B-002", patient: "Siti Aminah", doctor: "dr. Rina Sari", poli: "Poli Kulit", date: "2024-03-20", time: "10:30", status: "Menunggu" },
          { id: "B-003", patient: "Joko Susilo", doctor: "dr. Budi Santoso", poli: "Poli Gigi", date: "2024-03-21", time: "08:00", status: "Terkonfirmasi" },
     ];

     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                         <h1 className="text-2xl font-bold text-slate-800">Booking Pasien</h1>
                         <p className="text-slate-500">Daftar perjanjian pasien via Mobile/Web.</p>
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Pilih Tanggal
                         </Button>
                         <Button className="bg-[#125eab] hover:bg-blue-700">
                              + Booking Manual
                         </Button>
                    </div>
               </div>

               <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input placeholder="Cari nama pasien atau no booking..." className="pl-9 max-w-sm" />
               </div>

               <div className="grid gap-4">
                    {bookings.map((booking) => (
                         <Card key={booking.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                   <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                             <span className="font-bold text-lg">{booking.patient}</span>
                                             <Badge variant="outline" className="text-xs">{booking.id}</Badge>
                                        </div>
                                        <div className="text-sm text-slate-500">
                                             {booking.doctor} • {booking.poli}
                                        </div>
                                   </div>

                                   <div className="flex flex-col md:items-end gap-1">
                                        <div className="font-medium flex items-center gap-2 text-slate-700">
                                             <CalendarIcon className="w-4 h-4" />
                                             {booking.date} - {booking.time}
                                        </div>
                                        <Badge
                                             variant={booking.status === "Terkonfirmasi" ? "default" : "secondary"}
                                             className={booking.status === "Terkonfirmasi" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                                        >
                                             {booking.status}
                                        </Badge>
                                   </div>

                                   <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                                        <Button variant="outline" size="sm" className="flex-1 md:flex-none">Reschedule</Button>
                                        <Button size="sm" className="flex-1 md:flex-none bg-[#125eab] hover:bg-blue-700">Check-in</Button>
                                   </div>
                              </CardContent>
                         </Card>
                    ))}
               </div>
          </div>
     );
}
