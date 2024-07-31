import { NextResponse } from "next/server";

export function middleware(req) {
  const cookies = req.cookies; // Get cookies from the request
  const empCode = cookies.get("empCode"); // Access empCode cookie

  // If no empCode cookie is found and the requested path is not /login, redirect to /login
  if (!empCode && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If empCode cookie is present and the requested path is /logout, clear the cookie and redirect to /login
  if (empCode && req.nextUrl.pathname === "/logout") {
    const response = NextResponse.redirect(new URL("/login", req.url));
    req.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, "", { expires: new Date(0) });
    });
    console.log("Cookies cleared");
    return response;
  }

  // If empCode cookie is present and the requested path is /login, redirect to /
  if (empCode && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/logout", "/login"], // Include paths that need authentication
};
