import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

                         const user = await prisma.user.findUnique({
                              where: { email },
                         });

                         if (user && user.password) {
                              const passwordsMatch = await bcrypt.compare(password, user.password);
                              if (passwordsMatch) {
                                   return {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                   };
                              }
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
