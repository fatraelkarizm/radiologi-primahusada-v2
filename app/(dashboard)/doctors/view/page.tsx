"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, User } from "lucide-react";

export default function ViewDoctorSchedulePage() {
     const [date, setDate] = useState<Date | undefined>(new Date());

     // Mock schedule data
     const schedules = [
          { id: 1, doctor: "dr. Andi Wijaya", poli: "Poli Umum", time: "08:00 - 14:00", patients: 12 },
          { id: 2, doctor: "dr. Budi Santoso", poli: "Poli Gigi", time: "09:00 - 15:00", patients: 8 },
          { id: 3, doctor: "dr. Siti Aminah", poli: "Poli KIA", time: "08:00 - 12:00", patients: 5 },
          { id: 4, doctor: "dr. Rina Sari", poli: "Poli Kulit", time: "16:00 - 20:00", patients: 3 },
     ];

     return (
          <div className="space-y-6">
               <div className="flex flex-col md:flex-row gap-6">
                    {/* Calendar Sidebar */}
                    <Card className="w-full md:w-auto h-fit">
                         <CardContent className="p-4">
                              <Calendar
                                   mode="single"
                                   selected={date}
                                   onSelect={setDate}
                                   className="rounded-md border shadow-sm"
                              />
                         </CardContent>
                    </Card>

                    {/* Schedule List */}
                    <div className="flex-1 space-y-4">
                         <div className="flex items-center justify-between">
                              <h2 className="text-xl font-semibold text-slate-800">
                                   Jadwal Dokter - {date?.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                              </h2>
                              <Select defaultValue="all">
                                   <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter Poli" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="all">Semua Poli</SelectItem>
                                        <SelectItem value="umum">Poli Umum</SelectItem>
                                        <SelectItem value="gigi">Poli Gigi</SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>

                         <div className="grid gap-4">
                              {schedules.map((schedule) => (
                                   <Card key={schedule.id} className="hover:border-blue-200 transition-colors">
                                        <CardContent className="p-4 flex items-center justify-between">
                                             <div className="flex items-center gap-4">
                                                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#125eab]">
                                                       <User className="w-6 h-6" />
                                                  </div>
                                                  <div>
                                                       <h3 className="font-semibold text-lg">{schedule.doctor}</h3>
                                                       <p className="text-sm text-slate-500">{schedule.poli}</p>
                                                  </div>
                                             </div>

                                             <div className="flex items-center gap-6 text-sm text-slate-600">
                                                  <div className="flex items-center gap-2">
                                                       <Clock className="w-4 h-4 text-[#125eab]" />
                                                       {schedule.time}
                                                  </div>
                                                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                                                       <User className="w-3 h-3" />
                                                       {schedule.patients} Pasien
                                                  </div>
                                                  <Button variant="outline" size="sm" className="text-[#125eab] border-blue-200 hover:bg-blue-50">
                                                       Detail
                                                  </Button>
                                             </div>
                                        </CardContent>
                                   </Card>
                              ))}
                         </div>
                    </div>
               </div>
          </div>
     );
}
