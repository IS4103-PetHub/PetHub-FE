import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { AccountTypeEnum } from "./types/constants";

// Put all shared pages here
const sharedPages = ["/account", "/shared1", "/shared2"];

// This checks the last page path of the URL
function isSharedPage(path: string) {
  return sharedPages.some((page) => path.endsWith(page));
}

/*
  Current page protection rules:

      or the path does not end with a shared page route (e.g. /account)

  2. A path prepended with /business can only be accessed by PB, /customer can only be accessed by PO, 
      else, redirect to the respective home pages ('/' for PO, /business/dashboard for PB)

  3. If a user is a PB and the path is not prepended with /business, redirect to /business/dashboard

  4. If the end of the path is valid (e.g. /account), prepending it with something thats invalid like /potato will redirect to the home page '/'. 
      (This only applies to POs, as PBs will already get redirected during rule 3 to the business dashboard)
*/

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;
    const isBusinessPath = pathname.startsWith("/business");
    const isCustomerPath = pathname.startsWith("/customer");
    const isOtherPath =
      !isBusinessPath && !isCustomerPath && isSharedPage(pathname); // We don't want potato

    // If no session and you are tryna access a shared page or a protected path, redirect to home, else let it be
    if (!token) {
      if (
        (!isBusinessPath && !isCustomerPath && !isSharedPage(pathname)) ||
        pathname === "/"
      )
        return;
      return NextResponse.redirect(new URL("/", req.url));
    }

    /*
      All the checks below are for those with an existing session (either PB or PO)
    */

    // If the path starts with /business and you are not a PB, redirect to home
    if (
      isBusinessPath &&
      token.user["accountType"] !== AccountTypeEnum.PetBusiness
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If the path does not start with /business and you are a PB, go back to business dashboard
    if (
      !isBusinessPath &&
      token.user["accountType"] === AccountTypeEnum.PetBusiness
    ) {
      return NextResponse.redirect(new URL("/business/dashboard", req.url));
    }

    // If the path starts with /customer and you are not a PO, redirect to business dashboard
    if (
      isCustomerPath &&
      token.user["accountType"] !== AccountTypeEnum.PetOwner
    ) {
      return NextResponse.redirect(new URL("/business/dashboard", req.url));
    }

    // If the path starts with something like /potato, redirect to home
    if (isOtherPath) {
      return NextResponse.redirect(new URL("/", req.url));
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
