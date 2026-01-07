import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { mockUsers } from "@/lib/mock-data";

export const { handlers, auth, signIn, signOut } = NextAuth({
     providers: [
          Credentials({
               credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" },
               },
               authorize: async (credentials) => {
                    const parsedCredentials = z
                         .object({ email: z.string().email(), password: z.string().min(1) })
                         .safeParse(credentials);

                    if (parsedCredentials.success) {
                         const { email, password } = parsedCredentials.data;

                         // Mock authentication - for demo only
                         // Accept any email from mockUsers with password: "demo123"
                         const user = mockUsers.find(u => u.email === email);

                         if (user && password === "demo123") {
                              return {
                                   id: user.id,
                                   name: user.name,
                                   email: user.email,
                              };
                         }
                    }

                    console.log("Invalid credentials");
                    return null;
               },
          }),
     ],
     pages: {
          signIn: "/login",
     },
     callbacks: {
          async session({ session, token }) {
               if (token.sub && session.user) {
                    // session.user.id = token.sub;
               }
               return session;
          },
          async jwt({ token }) {
               return token;
          },
     },
});
