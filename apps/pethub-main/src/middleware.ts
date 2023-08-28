import { withAuth } from "next-auth/middleware";

export default withAuth({
  // triggers a callback to the current page if conditions are not met
  callbacks: {
    authorized({ req, token }) {
      // `/business/*` requires petBusiness role
      if (req.nextUrl.pathname.startsWith("/business")) {
        return token.user["role"] === "petBusiness";
      }
      // `/anyotherroute` thats in the matcher only requires the user to be logged in
      return !!token;
    },
  },
});

export const config = { matcher: ["/business/:path*"] };
