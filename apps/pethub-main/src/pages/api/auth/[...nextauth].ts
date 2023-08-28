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
        };
        const data = await loginService(loginCredentials);
        if (data && data.status === "success") {
          // Change to fit API response when available
          const user = data.payload;
          return user;
        } else {
          return null;
        }
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
  // callbacks: {
  //   jwt({ token, user }) {
  //     if (user) {
  //       token.name = user.name;
  //       token.role = user.role;
  //       token.userId = user.userId;
  //     }
  //     return token;
  //   },
  //   session({ session, token }) {
  //     session.user.name = token.name;
  //     session.user.role = token.role;
  //     session.user.userId = token.userId;
  //     return session;
  //   },
  // },
};

export default NextAuth(authOptions);
