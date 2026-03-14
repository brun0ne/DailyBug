import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "User",
          type: "username"
        },
        password: {
            label: "Password",
            type: "password"
        }
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials.password === (process.env.ADMIN_SECRET ?? "ThisShouldNotBeUsed!!@#$%!@@")) {
            const user = { id: "1", name: "Admin" };
            return user;
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/signin'
  }
};