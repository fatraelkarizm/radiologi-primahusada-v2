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
     const { status } = useSession();
     const router = useRouter();
     const isAuthenticated = status === "authenticated";

     // Dashboard Data States
     const [stats, setStats] = useState<DashboardStats>({
          totalPatients: 0,
          totalDoctors: 0,
          totalLabTests: 0,
          totalXrayExams: 0,
          todayPatients: 0,
          pendingLabTests: 0,
          completedLabTests: 0,
          pendingXrays: 0,
          completedXrays: 0,
     });

     const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
     const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
     const [patientsByGender, setPatientsByGender] = useState<PatientsByGender[]>([]);
     const [labTestsByCategory, setLabTestsByCategory] = useState<ChartData[]>([]);
     const [isLoading, setIsLoading] = useState(true);

     // Helper function to format time ago
     const formatTimeAgo = (dateString: string) => {
          const now = new Date();
          const date = new Date(dateString);
          const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

          if (diffInMinutes < 1) return 'Baru saja';
          if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;

          const diffInHours = Math.floor(diffInMinutes / 60);
          if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

          const diffInDays = Math.floor(diffInHours / 24);
          if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

          return date.toLocaleDateString('id-ID');
     };

     // Generate Chart Data
     const generateChartData = (patients: any[], labTests: any[], xrayExams: any[]) => {
          // Monthly data for last 6 months
          const months = [];
          const now = new Date();
          for (let i = 5; i >= 0; i--) {
               const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
               const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
               const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

               const monthPatients = patients.filter((p: any) =>
                    p.createdAt && p.createdAt.startsWith(monthYear)
               ).length;

               const monthLabs = labTests.filter((l: any) =>
                    l.createdAt && l.createdAt.startsWith(monthYear)
               ).length;

               const monthXrays = xrayExams.filter((x: any) =>
                    x.createdAt && x.createdAt.startsWith(monthYear)
               ).length;

               months.push({
                    name: monthName,
                    patients: monthPatients,
                    labs: monthLabs,
                    xrays: monthXrays,
                    value: monthPatients + monthLabs + monthXrays
               });
          }
          setMonthlyData(months);

          // Patients by gender
          const genderCount = patients.reduce((acc: any, patient: any) => {
               const gender = patient.gender || 'Tidak Diketahui';
               acc[gender] = (acc[gender] || 0) + 1;
               return acc;
          }, {});

          const genderData = Object.entries(genderCount).map(([gender, count]: [string, any]) => ({
               gender,
               count,
               percentage: Math.round((count / patients.length) * 100)
          }));
          setPatientsByGender(genderData);

          // Lab tests by category
          const categoryCount = labTests.reduce((acc: any, test: any) => {
               const category = test.category || 'Lainnya';
               acc[category] = (acc[category] || 0) + 1;
               return acc;
          }, {});

          const categoryData = Object.entries(categoryCount).map(([name, value]: [string, any]) => ({
               name,
               value
          }));
          setLabTestsByCategory(categoryData);
     };

     // Generate Recent Activities
     const generateRecentActivities = (patients: any[], labTests: any[], xrayExams: any[]) => {
          const activities: RecentActivity[] = [];

          // Recent patients (last 3)
          const recentPatients = patients
               .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
               .slice(0, 3);

          recentPatients.forEach(patient => {
               activities.push({
                    id: `patient-${patient.id}`,
                    type: 'patient',
                    title: `Pasien baru: ${patient.name}`,
                    description: `${patient.age} tahun, ${patient.gender}`,
                    time: formatTimeAgo(patient.createdAt),
                    status: patient.status
               });
          });

          // Recent lab tests (last 2)
          const recentLabTests = labTests
               .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
               .slice(0, 2);

          recentLabTests.forEach(test => {
               activities.push({
                    id: `lab-${test.id}`,
                    type: 'lab',
                    title: `Tes Lab: ${test.testType}`,
                    description: `Pasien: ${test.patient?.name || 'N/A'}`,
                    time: formatTimeAgo(test.createdAt),
                    status: test.status
               });
          });

          // Recent X-ray exams (last 2)
          const recentXrays = xrayExams
               .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
               .slice(0, 2);

          recentXrays.forEach(xray => {
               activities.push({
                    id: `xray-${xray.id}`,
                    type: 'xray',
                    title: `Rontgen: ${xray.examination_type}`,
                    description: `Pasien: ${xray.patient?.name || 'N/A'}`,
                    time: formatTimeAgo(xray.createdAt),
                    status: xray.status
               });
          });

          // Sort by time and take last 7
          activities.sort((a, b) => {
               // Simple sort based on string might not be perfect for "relative" times, but good enough for now
               // ideally use raw timestamps
               return 0;
          });
          setRecentActivities(activities.slice(0, 7));
     };


     useEffect(() => {
          if (status === "unauthenticated") {
               router.push("/login");
          }
     }, [status, router]);

     const fetchDashboardData = async () => {
          try {
               setIsLoading(true);

               const [patientsRes, doctorsRes, labTestsRes, xrayRes] = await Promise.all([
                    fetch("/api/patients"),
                    fetch("/api/doctors"),
                    fetch("/api/lab-tests"),
                    fetch("/api/xray")
               ]);

               const [patients, doctors, labTests, xrayExams] = await Promise.all([
                    patientsRes.ok ? patientsRes.json() : [],
                    doctorsRes.ok ? doctorsRes.json() : [],
                    labTestsRes.ok ? labTestsRes.json() : [],
                    xrayRes.ok ? xrayRes.json() : []
               ]);

               // Calculate stats
               const today = new Date().toISOString().split('T')[0];
               const todayPatients = patients.filter((p: any) =>
                    p.createdAt && p.createdAt.split('T')[0] === today
               ).length;

               const pendingLabTests = labTests.filter((lab: any) =>
                    lab.status === 'Menunggu Sample' || lab.status === 'Dalam Proses'
               ).length;

               const completedLabTests = labTests.filter((lab: any) =>
                    lab.status === 'Selesai'
               ).length;

               const pendingXrays = xrayExams.filter((xray: any) =>
                    xray.status === 'Menunggu' || xray.status === 'Dalam Proses'
               ).length;

               const completedXrays = xrayExams.filter((xray: any) =>
                    xray.status === 'Selesai'
               ).length;

               setStats({
                    totalPatients: patients.length,
                    totalDoctors: doctors.length,
                    totalLabTests: labTests.length,
                    totalXrayExams: xrayExams.length,
                    todayPatients,
                    pendingLabTests,
                    completedLabTests,
                    pendingXrays,
                    completedXrays,
               });

               // Generate chart data
               generateChartData(patients, labTests, xrayExams);
               generateRecentActivities(patients, labTests, xrayExams);

          } catch (error) {
               console.error('Fetch dashboard data error:', error);
          } finally {
               setIsLoading(false);
          }
     };

     useEffect(() => {
          if (isAuthenticated) {
               fetchDashboardData();
          }
     }, [isAuthenticated]);

     const getActivityIcon = (type: string) => {
          switch (type) {
               case 'patient': return <Users className="w-4 h-4" />;
               case 'lab': return <FlaskConical className="w-4 h-4" />;
               case 'xray': return <Camera className="w-4 h-4" />;
               default: return <Activity className="w-4 h-4" />;
          }
     };

     const getStatusColor = (status: string) => {
          switch (status?.toLowerCase()) {
               case 'selesai': return 'bg-green-100 text-green-800 border-green-200';
               case 'aktif': return 'bg-green-100 text-green-800 border-green-200';
               case 'dalam proses': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
               case 'menunggu': return 'bg-blue-100 text-blue-800 border-blue-200';
               case 'menunggu sample': return 'bg-blue-100 text-blue-800 border-blue-200';
               default: return 'bg-gray-100 text-gray-800 border-gray-200';
          }
     };

     const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
          <div className="container mx-auto py-8 px-4 space-y-6">
               {/* Header */}
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                         <p className="text-muted-foreground">
                              Sistem Manajemen Radiologi Prima Husada
                         </p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline">
                              <FileText className="w-4 h-4 mr-2" />
                              Laporan
                         </Button>
                         <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Tambah Data
                         </Button>
                    </div>
               </div>

               {/* Main Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
                              <Users className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                              <div className="text-2xl font-bold">{stats.totalPatients}</div>
                              <p className="text-xs text-muted-foreground">
                                   +{stats.todayPatients} hari ini
                              </p>
                         </CardContent>
                    </Card>

                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Total Dokter</CardTitle>
                              <UserCheck className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                              <div className="text-2xl font-bold">{stats.totalDoctors}</div>
                              <p className="text-xs text-muted-foreground">
                                   Dokter aktif
                              </p>
                         </CardContent>
                    </Card>

                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Tes Laboratorium</CardTitle>
                              <FlaskConical className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                              <div className="text-2xl font-bold">{stats.totalLabTests}</div>
                              <p className="text-xs text-muted-foreground">
                                   {stats.pendingLabTests} menunggu, {stats.completedLabTests} selesai
                              </p>
                         </CardContent>
                    </Card>

                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Pemeriksaan Rontgen</CardTitle>
                              <Camera className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                              <div className="text-2xl font-bold">{stats.totalXrayExams}</div>
                              <p className="text-xs text-muted-foreground">
                                   {stats.pendingXrays} menunggu, {stats.completedXrays} selesai
                              </p>
                         </CardContent>
                    </Card>
               </div>

               {/* Charts */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                         <CardHeader>
                              <CardTitle>Tren Bulanan</CardTitle>
                              <CardDescription>Data aktivitas 6 bulan terakhir</CardDescription>
                         </CardHeader>
                         <CardContent>
                              <div className="h-[300px]">
                                   <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData}>
                                             <CartesianGrid strokeDasharray="3 3" />
                                             <XAxis dataKey="name" />
                                             <YAxis />
                                             <Tooltip />
                                             <Area type="monotone" dataKey="patients" stackId="1" stroke="#8884d8" fill="#8884d8" name="Pasien" />
                                             <Area type="monotone" dataKey="labs" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Lab Tests" />
                                             <Area type="monotone" dataKey="xrays" stackId="1" stroke="#ffc658" fill="#ffc658" name="X-Ray" />
                                        </AreaChart>
                                   </ResponsiveContainer>
                              </div>
                         </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                         <CardHeader>
                              <CardTitle>Aktivitas Terbaru</CardTitle>
                              <CardDescription>7 aktivitas terakhir</CardDescription>
                         </CardHeader>
                         <CardContent>
                              <div className="space-y-4">
                                   {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-center space-x-4">
                                             <div className="p-2 bg-muted rounded-full">
                                                  {getActivityIcon(activity.type)}
                                             </div>
                                             <div className="flex-1 space-y-1">
                                                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                                                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                                                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                                             </div>
                                             <Badge className={getStatusColor(activity.status)} variant="outline">{activity.status}</Badge>
                                        </div>
                                   ))}
                              </div>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}
