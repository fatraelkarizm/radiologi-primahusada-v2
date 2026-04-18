"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
     Users,
     UserCheck,
     Loader2,
} from "lucide-react";
import {
     AreaChart,
     Area,
     XAxis,
     YAxis,
     CartesianGrid,
     Tooltip,
     ResponsiveContainer,
     PieChart,
     Pie,
     Cell
} from "recharts";

type DashboardStats = {
     totalPatients: number;
     totalDoctors: number;
     totalLabTests: number;
     totalXrayExams: number;
     todayRegistrations: number;
     pendingLabTests: number;
     pendingXrays: number;
};

export default function Dashboard() {
     const { status } = useSession();
     const router = useRouter();
     const isAuthenticated = status === "authenticated";

     const [stats, setStats] = useState<DashboardStats | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          if (status === "unauthenticated") {
               router.push("/login");
          } else if (status === "authenticated") {
               fetchStats();
          }
     }, [status, router]);

     const fetchStats = async () => {
          try {
               const response = await fetch("/api/dashboard/stats");
               if (response.ok) {
                    const data = await response.json();
                    setStats(data);
               }
          } catch (error) {
               console.error("Failed to fetch dashboard stats:", error);
          } finally {
               setIsLoading(false);
          }
     };

     // Placeholder chart data
     const barData = [
          { name: 'Jan', value: 4 },
          { name: 'Feb', value: 2 },
          { name: 'Mar', value: stats?.totalPatients || 0 },
          { name: 'Apr', value: stats?.todayRegistrations || 0 },
          { name: 'Mei', value: 0 },
          { name: 'Jun', value: 0 },
     ];

     const pieData = [
          { name: 'Selesai', value: stats ? (stats.totalLabTests + stats.totalXrayExams) : 0, color: '#D9F99D' },
          { name: 'Menunggu', value: stats ? (stats.pendingLabTests + stats.pendingXrays) : 0, color: '#C7D2FE' },
     ];

     if (status === "loading" || isLoading) {
          return (
               <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                         <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
                         <p>Memuat dashboard...</p>
                    </div>
               </div>
          );
     }

     if (!isAuthenticated) return null;

     return (
          <div className="space-y-6">
               {/* Welcome Banner */}
               <Card className="bg-white border-none shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between p-8 relative">
                         <div className="space-y-4 z-10 max-w-2xl">
                              <h1 className="text-2xl md:text-3xl font-bold text-[#125eab]">
                                   Selamat Datang, Klinik Prima Husada !
                              </h1>
                              <p className="text-slate-500 text-sm md:text-base max-w-xl">
                                   Destinasi Klinik merupakan aplikasi Rekam Medis Elektronik (RME) Terintegrasi yang dikembangkan oleh Prima Husada.
                              </p>

                              <div className="pt-4 space-y-2">
                                   <p className="text-sm font-medium text-slate-700">Tekan salah satu tombol di bawah untuk menggunakan fitur tambahan.</p>
                                   <div className="flex gap-2 flex-wrap">
                                        <Button variant="outline" className="text-[#125eab] border-[#125eab] hover:bg-blue-50 h-8 text-xs">
                                             Pendaftaran Online
                                        </Button>
                                        <Button variant="outline" className="text-[#125eab] border-[#125eab] hover:bg-blue-50 h-8 text-xs">
                                             Display Antrian
                                        </Button>
                                        <Button variant="outline" className="text-[#125eab] border-[#125eab] hover:bg-blue-50 h-8 text-xs">
                                             Kiosk
                                        </Button>
                                   </div>
                              </div>
                         </div>

                         <div className="hidden md:block absolute right-0 bottom-0 h-full w-1/3">
                              <div className="h-full w-full bg-linear-to-l from-blue-50 to-transparent flex items-end justify-center pb-4">
                                   <UserCheck className="w-32 h-32 text-blue-200 opacity-50" />
                              </div>
                         </div>
                    </div>
               </Card>

               {/* Stats Summary */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                         { title: "Total Pasien", value: stats?.totalPatients || 0, icon: Users },
                         { title: "Total Dokter", value: stats?.totalDoctors || 0, icon: UserCheck },
                         { title: "Pemeriksaan Lab", value: stats?.totalLabTests || 0, icon: Users },
                         { title: "Pemeriksaan Rontgen", value: stats?.totalXrayExams || 0, icon: Users },
                    ].map((item, i) => (
                         <Card key={i} className="shadow-sm border-slate-100">
                              <CardContent className="p-6">
                                   <h3 className="text-xs font-medium text-slate-500 mb-2">{item.title}</h3>
                                   <div className="flex items-end gap-2">
                                        <item.icon className="w-5 h-5 text-slate-400 mb-1" />
                                        <span className="text-2xl font-semibold text-slate-700">{item.value}</span>
                                   </div>
                              </CardContent>
                         </Card>
                    ))}
               </div>

               {/* Status Summary */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                         { title: "Pasien Baru Hari Ini", value: stats?.todayRegistrations || 0 },
                         { title: "Lab Menunggu", value: stats?.pendingLabTests || 0 },
                         { title: "X-Ray Menunggu", value: stats?.pendingXrays || 0 },
                    ].map((item, i) => (
                         <Card key={i} className="shadow-sm border-slate-100">
                              <CardContent className="p-6">
                                   <h3 className="text-xs font-medium text-slate-500 mb-2">{item.title}</h3>
                                   <div className="flex items-end gap-2">
                                        <span className="text-2xl font-semibold text-[#125eab]">{item.value}</span>
                                   </div>
                              </CardContent>
                         </Card>
                    ))}
               </div>

               {/* Charts Row */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 shadow-sm border-slate-100">
                         <CardHeader>
                              <CardTitle className="text-sm text-slate-600">Grafik Aktivitas Klinik</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <div className="h-[300px] w-full">
                                   <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                                             <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                                             <Tooltip />
                                             <Area type="monotone" dataKey="value" stroke="#125eab" strokeWidth={2} fill="#125eab" fillOpacity={0.1} />
                                        </AreaChart>
                                   </ResponsiveContainer>
                              </div>
                         </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-100">
                         <CardHeader>
                              <CardTitle className="text-sm text-slate-600">Status Pemeriksaan</CardTitle>
                              <CardDescription className="text-xs">Proporsi Selesai vs Menunggu</CardDescription>
                         </CardHeader>
                         <CardContent>
                              <div className="h-[200px] w-full relative">
                                   <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                             <Pie
                                                  data={pieData}
                                                  innerRadius={60}
                                                  outerRadius={80}
                                                  paddingAngle={5}
                                                  dataKey="value"
                                             >
                                                  {pieData.map((entry, index) => (
                                                       <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                                  ))}
                                             </Pie>
                                        </PieChart>
                                   </ResponsiveContainer>
                                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-2xl font-bold text-slate-700">
                                             {(stats?.totalLabTests || 0) + (stats?.totalXrayExams || 0)}
                                        </span>
                                        <span className="text-[10px] text-slate-500">Total</span>
                                   </div>
                              </div>
                              <div className="mt-6 space-y-3">
                                   {pieData.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                             <span className="text-sm text-slate-600 font-medium">{item.name}</span>
                                             <span className="text-xs text-slate-400 ml-auto">{item.value}</span>
                                        </div>
                                   ))}
                              </div>
                         </CardContent>
                    </Card>
               </div>

               <div className="text-center text-xs text-slate-400 pt-8 pb-4">
                    © 2026 dikembangkan oleh <span className="font-bold text-[#125eab]">Prima Husada</span>
               </div>
          </div>
     );
}

