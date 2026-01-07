"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
     LayoutDashboard,
     Settings,
     CalendarDays,
     Users,
     Stethoscope,
     ClipboardList,
     BriefcaseMedical,
     Wallet,
     FlaskConical,
     FileText,
     ShieldCheck,
     HeartPulse,
     Power,
     Receipt,
     ChevronRight,
     ChevronDown,
     Home,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Define strict types for menu items
type SubItem = {
     label: string;
     href: string;
};

type MenuItem = {
     label: string;
     icon?: any;
     href?: string;
     onClick?: () => void;
     subItems?: SubItem[];
};

type MenuSection = {
     title?: string;
     items: MenuItem[];
};

const menuGroups: MenuSection[] = [
     {
          title: "MENU",
          items: [
               {
                    label: "Pengaturan",
                    icon: Settings,
                    href: "/settings",
                    subItems: [
                         { label: "Klinik", href: "/settings/clinic" },
                         { label: "Akun", href: "/settings/account" },
                         { label: "Asuransi & Jaminan", href: "/settings/insurance" },
                         { label: "Layanan/Tindakan", href: "/settings/services" },
                         { label: "Poliklinik", href: "/settings/polyclinics" },
                         { label: "Tenaga Medis", href: "/settings/medical-staff" },
                         { label: "Default Laboratorium", href: "/settings/lab-defaults" },
                         { label: "Whatsapp Broadcast", href: "/settings/whatsapp" },
                    ],
               },
               {
                    label: "Jadwal Dokter",
                    icon: CalendarDays,
                    href: "/doctors",
                    subItems: [
                         { label: "Lihat Jadwal", href: "/doctors/view" },
                         { label: "Kelola Jadwal", href: "/doctors/manage" },
                    ]
               },
               { label: "Pasien", icon: Users, href: "/patients" },
               {
                    label: "Rawat Jalan",
                    icon: Stethoscope,
                    href: "/outpatient",
                    subItems: [
                         { label: "Booking", href: "/outpatient/booking" },
                         { label: "Registrasi", href: "/outpatient/registration" },
                         { label: "Antrian Poliklinik", href: "/outpatient/queue" },
                    ]
               },
               { label: "Rekam Medis", icon: ClipboardList, href: "/medical-records" },
               {
                    label: "Farmasi",
                    icon: BriefcaseMedical,
                    href: "/pharmacy",
                    subItems: [
                         { label: "Antrian", href: "/pharmacy/queue" },
                         { label: "Data Barang", href: "/pharmacy/items" },
                         { label: "Harga Jual", href: "/pharmacy/prices" },
                         { label: "Barang Masuk", href: "/pharmacy/in" },
                         { label: "Penjualan Umum", href: "/pharmacy/sales" },
                         { label: "Barang Keluar", href: "/pharmacy/out" },
                         { label: "Stok Opname", href: "/pharmacy/stock" },
                         { label: "Pemakaian Barang", href: "/pharmacy/usage" },
                         { label: "Pemusnahan Barang", href: "/pharmacy/disposal" },
                    ]
               },
               { label: "Pembayaran", icon: Wallet, href: "/payments" },
               { label: "Laboratorium", icon: FlaskConical, href: "/lab" },
               {
                    label: "Laporan",
                    icon: FileText,
                    href: "/reports",
                    subItems: [
                         { label: "Pendapatan", href: "/reports/revenue" },
                         { label: "Komisi", href: "/reports/commission" },
                         { label: "Rekap Buku Stok", href: "/reports/stock-recap" },
                         { label: "10 Besar Penyakit", href: "/reports/top-diseases" },
                         { label: "Rekap Index Penyakit", href: "/reports/disease-index" },
                    ]
               },
               {
                    label: "PCare BPJS",
                    icon: ShieldCheck,
                    href: "/pcare",
                    subItems: [
                         { label: "Diagnosa", href: "/pcare/diagnosis" },
                         { label: "Dokter", href: "/pcare/doctor" },
                         { label: "Kesadaran", href: "/pcare/consciousness" },
                         { label: "Poli", href: "/pcare/poly" },
                         { label: "Poli Antrol", href: "/pcare/poly-antrol" },
                         { label: "Dokter Antrol", href: "/pcare/doctor-antrol" },
                         { label: "Provider", href: "/pcare/provider" },
                         { label: "Status Pulang", href: "/pcare/discharge-status" },
                         { label: "Spesialis", href: "/pcare/specialist" },
                         { label: "Sub Spesialis", href: "/pcare/sub-specialist" },
                         { label: "Sarana", href: "/pcare/facilities" },
                         { label: "Khusus", href: "/pcare/special" },
                         { label: "Rujukan Subspesialis", href: "/pcare/reference-sub" },
                         { label: "Rujukan Khusus 1", href: "/pcare/reference-special-1" },
                         { label: "Rujukan Khusus 2", href: "/pcare/reference-special-2" },
                         { label: "Pendaftaran", href: "/pcare/registration" },
                    ]
               },
               { label: "Satu Sehat", icon: HeartPulse, href: "/satusehat" },
          ],
     },
     {
          title: "PENGGUNA",
          items: [
               { label: "Langganan", icon: Receipt, href: "/subscription" },
               { label: "Keluar", icon: Power, onClick: () => signOut({ callbackUrl: "/login" }) },
          ],
     },
];

export function Sidebar() {
     const pathname = usePathname();
     const { data: session } = useSession();

     // State to manage open sub-menus
     const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

     // Auto-open menu if child is active
     useEffect(() => {
          const newOpenMenus = { ...openMenus };
          menuGroups.forEach(group => {
               group.items.forEach(item => {
                    if (item.subItems) {
                         const isChildActive = item.subItems.some(sub => pathname === sub.href);
                         if (isChildActive) {
                              newOpenMenus[item.label] = true;
                         }
                    }
               });
          });
          setOpenMenus(newOpenMenus);
     }, [pathname]);

     const toggleMenu = (label: string) => {
          setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
     };

     return (
          <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-white text-slate-800 z-30 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
               {/* Logo Section */}
               <div className="flex h-16 items-center px-6 py-4">
                    <div className="flex items-center gap-2 font-bold text-xl text-[#125eab]">
                         <div className="relative h-8 w-8">
                              {/* Using standard image or fallback */}
                              <Image
                                   src="/Logo_PH.jpg"
                                   alt="Logo"
                                   fill
                                   className="object-contain"
                              />
                         </div>
                         <span className="text-lg">Klinik Prima Husada</span>
                    </div>
               </div>

               <div className="px-4 mb-2">
                    <Link
                         href="/dashboard"
                         className={cn(
                              "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors text-white",
                              "bg-[#125eab] hover:bg-[#0f4b8a] shadow-sm"
                         )}
                    >
                         <Home className="h-5 w-5" />
                         Dashboard
                    </Link>
               </div>

               {/* Navigation */}
               <nav className="flex-1 space-y-6 px-4 py-2">
                    {menuGroups.map((group, idx) => (
                         <div key={idx}>
                              {group.title && (
                                   <h3 className="mb-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {group.title}
                                   </h3>
                              )}
                              <div className="space-y-1">
                                   {group.items.map((item) => {
                                        const isActive = item.href ? pathname === item.href || pathname.startsWith(`${item.href}/`) : false;
                                        const Icon = item.icon;
                                        const hasSubItems = item.subItems && item.subItems.length > 0;
                                        const isOpen = openMenus[item.label];

                                        if (hasSubItems) {
                                             return (
                                                  <div key={item.label}>
                                                       <button
                                                            onClick={() => toggleMenu(item.label)}
                                                            className={cn(
                                                                 "flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-[#125eab]",
                                                                 isActive ? "text-[#125eab]" : "text-slate-600"
                                                            )}
                                                       >
                                                            <div className="flex items-center gap-3">
                                                                 {Icon && <Icon className="h-5 w-5" />}
                                                                 {item.label}
                                                            </div>
                                                            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                       </button>
                                                       {isOpen && (
                                                            <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-100 pl-2">
                                                                 {item.subItems!.map((sub) => (
                                                                      <Link
                                                                           key={sub.href}
                                                                           href={sub.href}
                                                                           className={cn(
                                                                                "block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-blue-50 hover:text-[#125eab]",
                                                                                pathname === sub.href ? "text-[#125eab] font-medium bg-blue-50" : "text-slate-500"
                                                                           )}
                                                                      >
                                                                           {sub.label}
                                                                      </Link>
                                                                 ))}
                                                            </div>
                                                       )}
                                                  </div>
                                             );
                                        }

                                        if (item.onClick) {
                                             return (
                                                  <button
                                                       key={item.label}
                                                       onClick={item.onClick}
                                                       className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                                                  >
                                                       {Icon && <Icon className="h-5 w-5" />}
                                                       {item.label}
                                                  </button>
                                             )
                                        }

                                        return (
                                             <Link
                                                  key={item.href}
                                                  href={item.href!}
                                                  className={cn(
                                                       "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-[#125eab]",
                                                       isActive
                                                            ? "text-[#125eab] bg-blue-50"
                                                            : "text-slate-600"
                                                  )}
                                             >
                                                  {Icon && <Icon className="h-5 w-5" />}
                                                  {item.label}
                                             </Link>
                                        );
                                   })}
                              </div>
                         </div>
                    ))}
               </nav>

               {/* Footer / Version if needed */}
               <div className="p-4 text-xs text-slate-300 text-center">
                    v1.3.6
               </div>
          </div>
     );
}
