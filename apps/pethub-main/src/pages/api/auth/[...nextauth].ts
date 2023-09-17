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
      name: `${cookiePrefix}next-auth.session-token-main`,
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url-main`,
      options: {
        sameSite: "strict",
        path: "/",
      },
    },
    csrfToken: {
      name: `${cookiePrefix}next-auth.csrf-token-main`,
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier-main`,
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 900,
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state-main`,
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 900,
      },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce-main`,
      options: {
        httpOnly: true,
        sameSite: "strict",
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
