import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
     providers: [
          Credentials({
               credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" },
               },
               authorize: async (credentials) => {
                    const parsedCredentials = z
                         .object({ email: z.string().email(), password: z.string().min(1) }) // min 1 primarily to allow any password for testing if needed
                         .safeParse(credentials);

                    if (parsedCredentials.success) {
                         const { email, password } = parsedCredentials.data;
                         const user = await prisma.user.findUnique({ where: { email } });
                         if (!user) return null;

                         // Note: In a real app, use bcrypt.compare
                         // For now, if the user was created manually without hashing or implementation details vary
                         // I will assume hashed.
                         const passwordsMatch = await bcrypt.compare(password, user.password as string);

                         // Fallback for plain text (migration phase helper, remove in prod)
                         if (!passwordsMatch && password === user.password) return user;

                         if (passwordsMatch) return user;
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
                    // session.user.id = token.sub; // Types might need extension
               }
               return session;
          },
          async jwt({ token }) {
               return token;
          },
     },
});
