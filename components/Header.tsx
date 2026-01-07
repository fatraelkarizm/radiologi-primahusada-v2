"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
     const pathname = usePathname();
     const { data: session } = useSession();

     // Map pathname to readable title
     const getPageTitle = () => {
          if (pathname.includes("/dashboard")) return "Dashboard";
          if (pathname.includes("/patients")) return "Pasien";
          if (pathname.includes("/doctors")) return "Dokter";
          if (pathname.includes("/lab")) return "Laboratorium";
          if (pathname.includes("/xray")) return "Radiologi";
          return "Prima Husada";
     };

     return (
          <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
               <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h2>
               </div>

               <div className="flex items-center gap-4">
                    <div className="relative hidden md:block w-72">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                         <Input
                              type="search"
                              placeholder="Cari..."
                              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary"
                         />
                    </div>
                    <Button size="icon" variant="ghost" className="text-slate-500">
                         <Bell className="h-5 w-5" />
                    </Button>
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs ring-2 ring-white">
                         {session?.user?.name?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
               </div>
          </header>
     );
}
