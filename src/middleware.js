import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role;

    if (path.startsWith("/login") || path.startsWith("/register") || path === "lupa_password") {
      if (token) {
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/ui_admin/dashboard", req.url));
        } else {
          return NextResponse.redirect(new URL("/ui_user/dashboard", req.url));
        }
      }
     
      return NextResponse.next();
    }

    
    if (path.startsWith("/ui_admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/ui_user/dashboard", req.url));
      }
    }

    if (path.startsWith("/ui_user")) {
      if (role !== "USER") {
        return NextResponse.redirect(new URL("/ui_admin/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (path.startsWith("/login") || path.startsWith("/register")) {
          return true;
        }

        return !!token;
      },
    },
  }
);


export const config = {
  matcher: [
    "/ui_admin/:path*", 
    "/ui_user/:path*",  
    "/login",           
    "/register",        
  ],
};