"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
     Users,
     Activity,
     FileText,
     LayoutDashboard,
     Settings,
     LogOut,
     Stethoscope,
     FlaskConical,
     Camera,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
     { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
     { icon: Users, label: "Pasien", href: "/patients" },
     { icon: Stethoscope, label: "Dokter", href: "/doctors" },
     { icon: FlaskConical, label: "Laboratorium", href: "/lab" },
     { icon: Camera, label: "Radiologi", href: "/xray" }, // Future update
     // { icon: FileText, label: "Laporan", href: "/reports" },
];

export function Sidebar() {
     const pathname = usePathname();
     const { data: session } = useSession();

     return (
          <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-white text-slate-800 shadow-sm z-30">
               {/* Logo Section */}
               <div className="flex h-16 items-center justify-center border-b px-6 bg-primary text-primary-foreground">
                    <div className="flex items-center gap-2 font-bold text-xl">
                         {/* Placeholder Logo - Replace with Image maybe? */}
                         <div className="bg-white text-blue-600 rounded p-1">PH</div>
                         <span>Prima Husada</span>
                    </div>
               </div>

               {/* Navigation */}
               <nav className="flex-1 space-y-1 px-3 py-4">
                    {sidebarItems.map((item) => {
                         const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                         return (
                              <Link
                                   key={item.href}
                                   href={item.href}
                                   className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                             ? "bg-primary text-primary-foreground shadow-sm"
                                             : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                   )}
                              >
                                   <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500")} />
                                   {item.label}
                              </Link>
                         );
                    })}
               </nav>

               {/* User / Footer */}
               <div className="border-t p-4 bg-slate-50">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                              {session?.user?.name?.substring(0, 2).toUpperCase() || "AD"}
                         </div>
                         <div className="overflow-hidden">
                              <p className="truncate text-sm font-medium text-slate-900">{session?.user?.name || "User"}</p>
                              <p className="truncate text-xs text-slate-500">{session?.user?.email}</p>
                         </div>
                    </div>
                    <Button
                         variant="outline"
                         className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                         onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                         <LogOut className="mr-2 h-4 w-4" />
                         Keluar
                    </Button>
               </div>
          </div>
     );
}
