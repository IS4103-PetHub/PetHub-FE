export { default } from "next-auth/middleware";

/*
  Configure logic to run before each page route access here.
  Currently set-up to require active session for all pages except login page: https://nextjs.org/docs/pages/building-your-application/routing/middleware#matcher
*/

export const config = {
  matcher: ["/((?!login|resetpassword).*)"],
};
