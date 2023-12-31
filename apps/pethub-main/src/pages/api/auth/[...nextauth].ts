import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "@/api/userService";
import { LoginCredentials } from "@/types/types";

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
          email: credentials.email,
          password: credentials.password,
          accountType: credentials.accountType,
        };
        let user;
        try {
          user = await loginService(loginCredentials);
        } catch (error) {
          throw new Error(error.response.data.message);
        }
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
      console.log(
        "Session object [from pages/api/auth/[...nextauth]]",
        session,
      );
      return session;
    },
  },
};

export default NextAuth(authOptions);
