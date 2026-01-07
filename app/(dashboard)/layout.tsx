"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     return (
          <div className="flex h-screen bg-slate-50">
               <Sidebar />
               <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                         {children}
                    </main>
               </div>
          </div>
     );
}
