import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "@/api/userService";
import { LoginCredentials } from "@/types";

type ExtendedUserType = User & { name: string; role: string; userId: Number };

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials?: any, req?: any) {
        const loginCredentials: LoginCredentials = {
          username: credentials.username,
          password: credentials.password,
          userType: credentials.userType,
        };
        const user = await loginService(loginCredentials);
        return user ? user : null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
