import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { AccountTypeEnum } from "./types/constants";

export default withAuth(
  function middleware(req) {
    // console.log(
    //   "From src/middleware.ts: Middleware activation at path:",
    //   req.nextUrl.pathname,
    // );

    /*
      Add/Modify redirections for customer pages or other pages in the future when they exist
    */

    // if you are not logged in and you are trying to access the home page: let it be
    if (!req.nextauth.token && req.nextUrl.pathname === "/") {
      return;
    }

    //if you are not logged in and you are trying to access a /business route: go back to home page
    if (!req.nextauth.token && req.nextUrl.pathname.startsWith("/business")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If you are not a PetBusiness and you are trying to access a /business route: go back to home page
    if (
      req.nextUrl.pathname.startsWith("/business") &&
      req.nextauth.token?.user["accountType"] !== AccountTypeEnum.PetBusiness
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If you are a PetBusiness and you are trying to access a non /business route: go back to business dashboard
    if (
      !req.nextUrl.pathname.startsWith("/business") &&
      req.nextauth.token?.user["accountType"] === AccountTypeEnum.PetBusiness
    ) {
      return NextResponse.redirect(new URL("/business/dashboard", req.url));
    }
  },
  {
    callbacks: {
      // Bypass the authorized callback that NextAuth checks for by allowing everything (and using the Next.js middleware function to check instead)
      authorized: ({ token }) => true,
    },
  },
);

// Trigger middleware checking at every path (no choice ah)
export const config = {
  matcher: ["/:path*"],
};
