import NextAuth, { CookieOption, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "@/api/userService";
import { LoginCredentials } from "@/types/types";

const useSecureCookies = process.env.NEXTAUTH_URL.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
console.log("cookieprefix", cookiePrefix);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
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
      session.user = token.user as any;
      console.log("Session object", session);
      return session;
    },
  },
};

export default NextAuth(authOptions);
