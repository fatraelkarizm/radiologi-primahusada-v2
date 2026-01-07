"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export default function LoginPage() {
     const router = useRouter();
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [error, setError] = useState<string | null>(null);
     const [loading, setLoading] = useState(false);

     const handleLogin = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          const result = await signIn("credentials", {
               email,
               password,
               redirect: false,
          });

          if (result?.error) {
               setError("Email atau password salah.");
               setLoading(false);
          } else {
               router.push("/dashboard"); // Redirect to dashboard
          }
     };

     return (
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
               <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                         <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
                              <Activity className="w-8 h-8 text-primary-foreground" />
                         </div>
                         <CardTitle className="text-2xl">Prima Husada</CardTitle>
                         <CardDescription>
                              Masukkan kredensial Anda untuk masuk ke sistem.
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <form onSubmit={handleLogin} className="space-y-4">
                              <div className="space-y-2">
                                   <Label htmlFor="email">Email</Label>
                                   <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@radiocare.com"
                                        required
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
                                        disabled={loading}
                                   />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="password">Password</Label>
                                   <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.currentTarget.value)}
                                        disabled={loading}
                                   />
                              </div>
                              {error && <p className="text-sm text-destructive">{error}</p>}
                              <Button type="submit" className="w-full" disabled={loading}>
                                   {loading ? "Memproses..." : "Login"}
                              </Button>
                         </form>
                         <div className="mt-4 text-center text-sm">
                              Belum punya akun?{" "}
                              <Link href="/register" className="underline">
                                   Daftar di sini
                              </Link>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
