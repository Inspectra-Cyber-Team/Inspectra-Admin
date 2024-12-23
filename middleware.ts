import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  console.log("========| Middleware Running |========");
  console.log("=> Request URL: ", request.url);
  console.log("=> Request Method: ", request.method);

  const authSessionToken = request.cookies.get("authjs.session-token");

  const inspectraSessionToken = request.cookies.get("InspectraRefreshToken");

  try {
    const decodedToken = jwt.decode(inspectraSessionToken?.value || "");

    if (
      !decodedToken ||
      typeof decodedToken !== "object" ||
      !decodedToken.role
    ) {
      throw new Error("Token does not contain role information");
    }

    const role = decodedToken.role;

    // Check if the role is ADMIN
    // Check if the role array contains "ROLE_ADMIN"
    if (!role.includes("ROLE_ADMIN")) {
      return NextResponse.redirect("/auth/login");
    }
  } catch (error) {
    console.error("Token decoding failed:", error);
    return NextResponse.redirect(
      new URL("/auth/login", request.url).toString()
    );
  }

  if (request.nextUrl.pathname != "auth/login/") {
    if (!inspectraSessionToken) {
      return NextResponse.redirect(new URL("/auth/login/", request.url)); // Redirect to login page
    }
  }
  if (request.nextUrl.pathname === "/auth/login/") {
    // If there is a session, redirect them away from /login
    if (inspectraSessionToken) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to home page or another appropriate page
    }
    if (authSessionToken) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to admin login page
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

// define when user visited these page and redirect into login when have no session
export const config = {
  matcher: [
    "/",
    "/user",
    "/admin",
    "/project",
    "/FAQs",
    "/feedback",
    "/document",
  ],
};
