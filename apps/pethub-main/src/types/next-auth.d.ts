import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       name: string;
//       role: string;
//       userId: Number;
//     };
//   }
//   interface User {
//     name: string;
//     role: string;
//     userId: Number;
//   }
// }

// declare module "next-auth/jwt" {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     name: string;
//     role: string;
//     userId: Number;
//   }
// }
