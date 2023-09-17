import { URLPattern } from "next/server";
import NextAuth, { CookieOption, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "@/api/userService";
import { LoginCredentials } from "@/types/types";

const useSecureCookies = process.env.NEXTAUTH_URL.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      },
    },
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
      console.log("Session object", session);
      return session;
    },
  },
};

export default NextAuth(authOptions);
