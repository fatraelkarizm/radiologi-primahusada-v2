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
import { Progress } from "@/components/ui/progress";
import {
     Calendar,
     Users,
     UserCheck,
     FlaskConical,
     Camera,
     TrendingUp,
     Activity,
     FileText,
     Plus,
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

// Types
type DashboardStats = {
     totalPatients: number;
     totalDoctors: number;
     totalLabTests: number;
     totalXrayExams: number;
     todayPatients: number;
     pendingLabTests: number;
     completedLabTests: number;
     pendingXrays: number;
     completedXrays: number;
};

type RecentActivity = {
     id: string;
     type: 'patient' | 'lab' | 'xray';
     title: string;
     description: string;
     time: string;
     status: string;
};

type ChartData = {
     name: string;
     value: number;
     patients?: number;
     labs?: number;
     xrays?: number;
};

type PatientsByGender = {
     gender: string;
     count: number;
     percentage: number;
};

export default function Dashboard() {
     const { status, data: session } = useSession();
     const router = useRouter();
     const isAuthenticated = status === "authenticated";

     // Dashboard Data States
     // In a real app, these would come from the API as before
     // For now, hardcoding to match the "empty" state in the screenshot or fetching what we can
     const [stats, setStats] = useState({
          bookingToday: 0,
          pendingToday: 0,
          unpaidToday: 0,
          completedToday: 0,
          visitsToday: 0,
          patientsToday: 0,
          visitsYear: 6,
          patientsYear: 4,
     });

     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          if (status === "unauthenticated") {
               router.push("/login");
          } else if (status === "authenticated") {
               setIsLoading(false);
          }
     }, [status, router]);

     const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

     // Mock data for charts to match screenshot
     const barData = [
          { name: 'Jan', value: 4 },
          { name: 'Feb', value: 0 },
          { name: 'Mar', value: 1 },
          { name: 'Apr', value: 0 },
          { name: 'May', value: 0 },
          { name: 'Jun', value: 0 },
          { name: 'Jul', value: 0 },
          { name: 'Aug', value: 0 },
          { name: 'Sep', value: 0 },
          { name: 'Okt', value: 1 },
          { name: 'Nov', value: 0 },
          { name: 'Des', value: 0 },
     ];

     const pieData = [
          { name: 'Laki-Laki', value: 1, color: '#C7D2FE' }, // Light purple/blue
          { name: 'Perempuan', value: 5, color: '#D9F99D' }, // Light green
     ];

     if (status === "loading" || isLoading) {
          return (
               <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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

                         {/* Illustration Placeholder */}
                         <div className="hidden md:block absolute right-0 bottom-0 h-full w-1/3">
                              {/* Using a placeholder SVG or just a div to represent the illustration area if no image asset available */}
                              <div className="h-full w-full bg-linear-to-l from-blue-50 to-transparent flex items-end justify-center pb-4">
                                   {/* Simple SVG representation of medical theme */}
                                   <UserCheck className="w-32 h-32 text-blue-200 opacity-50" />
                              </div>
                         </div>
                    </div>
               </Card>

               {/* Row 1: Daily Specifics */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                         { title: "Booking Hari Ini", value: stats.bookingToday },
                         { title: "Belum Diperiksa Hari Ini", value: stats.pendingToday },
                         { title: "Belum Bayar Hari Ini", value: stats.unpaidToday },
                         { title: "Selesai Hari Ini", value: stats.completedToday },
                    ].map((item, i) => (
                         <Card key={i} className="shadow-sm border-slate-100">
                              <CardContent className="p-6">
                                   <h3 className="text-xs font-medium text-slate-500 mb-2">{item.title}</h3>
                                   <div className="flex items-end gap-2">
                                        <Users className="w-5 h-5 text-slate-400 mb-1" />
                                        <span className="text-2xl font-semibold text-slate-700">{item.value}</span>
                                   </div>
                              </CardContent>
                         </Card>
                    ))}
               </div>

               {/* Row 2: Totals */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                         { title: "Total Kunjungan Hari Ini", value: stats.visitsToday },
                         { title: "Total Pasien Hari Ini", value: stats.patientsToday },
                         { title: "Total Kunjungan 2026", value: stats.visitsYear },
                         { title: "Total Pasien 2026", value: stats.patientsYear },
                    ].map((item, i) => (
                         <Card key={i} className="shadow-sm border-slate-100">
                              <CardContent className="p-6">
                                   <h3 className="text-xs font-medium text-slate-500 mb-2">{item.title}</h3>
                                   <div className="flex items-end gap-2">
                                        <Users className="w-5 h-5 text-slate-400 mb-1" />
                                        <span className="text-2xl font-semibold text-slate-700">{item.value}</span>
                                   </div>
                              </CardContent>
                         </Card>
                    ))}
               </div>

               {/* Charts Row */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar Chart */}
                    <Card className="lg:col-span-2 shadow-sm border-slate-100">
                         <CardHeader>
                              <CardTitle className="text-sm text-slate-600">Grafik Jumlah Kunjungan Tahun 2026</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <div className="h-[300px] w-full">
                                   <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                                             <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                                             <Tooltip />
                                             <Area type="step" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" />
                                             {/* Note: Screenshot looks like a very thin bar/line. Using scatter or bar with custom shape might be closer, but Area/Bar is standard */}
                                        </AreaChart>
                                   </ResponsiveContainer>
                              </div>
                         </CardContent>
                    </Card>

                    {/* Donut Chart */}
                    <Card className="shadow-sm border-slate-100">
                         <CardHeader>
                              <CardTitle className="text-sm text-slate-600">Statistik Kunjungan Tahun 2026</CardTitle>
                              <CardDescription className="text-xs">Berdasarkan Jenis Kelamin</CardDescription>
                         </CardHeader>
                         <CardContent>
                              <div className="h-[200px] w-full relative">
                                   <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                             <Pie
                                                  data={pieData}
                                                  innerRadius={60}
                                                  outerRadius={80}
                                                  paddingAngle={0}
                                                  dataKey="value"
                                             >
                                                  {pieData.map((entry, index) => (
                                                       <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                                  ))}
                                             </Pie>
                                        </PieChart>
                                   </ResponsiveContainer>
                                   {/* Center Text */}
                                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-2xl font-bold text-slate-700">6</span>
                                        <span className="text-[10px] text-slate-500">Tahun Ini</span>
                                   </div>
                              </div>
                              <div className="mt-6 space-y-3">
                                   {pieData.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: item.color }}>
                                                  <Users className="w-4 h-4 text-slate-600" />
                                             </div>
                                             <span className="text-sm text-slate-600">{item.name}</span>
                                        </div>
                                   ))}
                              </div>
                         </CardContent>
                    </Card>
               </div>

               <div className="text-center text-xs text-slate-400 pt-8 pb-4">
                    © 2026 dikembangkan oleh <span className="font-bold">Prima Husada</span>
               </div>
          </div>
     );
}
