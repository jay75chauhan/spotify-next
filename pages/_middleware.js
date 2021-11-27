import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req, res, next) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // allow the request to continue if no token is found

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // if no token is found, redirect to the login page

  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
