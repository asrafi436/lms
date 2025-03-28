import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { PUBLIC_ROUTES, LOGIN, ROOT } from "@/lib/routes";

const { auth } = NextAuth(authConfig); //public

export default auth((req) => {

    const { nextUrl } = req;
    const isAuthenticated = !!req.auth; // not-public

    const isPublicRoute = PUBLIC_ROUTES.some((route) => nextUrl.pathname.startsWith(route)) || nextUrl.pathname === ROOT;

                    // User Api access blocking

                        // Check if the request is for an API route
    // const isApiRoute = nextUrl.pathname.startsWith("/api/users"); 
     // Check if the request is for an API route
    //  const isApiRoute = nextUrl.pathname.startsWith("/api/");


    // if (isApiRoute && !isAuthApiRoute && !isAuthenticated) {
    //     return NextResponse.json(
    //         { error: "Unauthorized access to API" },
    //         { status: 401 }
    //     );
    // }


    if (!isAuthenticated && !isPublicRoute) {
        return NextResponse.redirect(new URL(LOGIN, nextUrl));
    }
    return NextResponse.next()


});

export const config = {
    matcher: [
        // Exclude Next.js internal routes and API routes
        // "/((?!_next|favicon.ico|.*\\..*).*)",
        // "/((?!api/auth|_next|favicon.ico|.*\\..*).*)",
        "/((?!api/|api/auth|_next|favicon.ico|.*\\..*).*)", 
        
        "/", // Include the root route
    ],
};