import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const pathname = req.nextUrl.pathname;

        console.log("Middleware Triggered:", { pathname, token });

        // Public paths and static file patterns
        const publicPaths = ["/student/login", "/admin/login", "/", "/api/auth/session"];
        const staticFilePatterns = [
            /^\/_next\//, // Next.js static files
            /^\/favicon.ico/, // Favicon
            /^\/images\//, // Images
            /^\/api\/auth\//, // Auth API routes
        ];

        // Skip middleware for public paths and static files
        if (
            publicPaths.includes(pathname) ||
            staticFilePatterns.some((pattern) => pattern.test(pathname))
        ) {
            console.log("Skipping middleware for:", pathname);
            return NextResponse.next();
        }

        // Protected routes for student
        if (pathname.startsWith("/student")) {
            if (!token) {
                console.log("Unauthorized Access: No token found for:", pathname);
                const redirectUrl = new URL("/student/login", req.url);
                const institution = req.nextUrl.searchParams.get("institution");
                if (institution) {
                    redirectUrl.searchParams.set("institution", institution);
                }
                return NextResponse.redirect(redirectUrl);
            }

            if (token.role !== "STUDENT") {  // Ensure role matches the expected one
                console.log("Unauthorized Access: Role mismatch for:", pathname);
                const redirectUrl = new URL("/student/login", req.url);
                const institution = req.nextUrl.searchParams.get("institution");
                if (institution) {
                    redirectUrl.searchParams.set("institution", institution);
                }
                return NextResponse.redirect(redirectUrl);
            }

            console.log("Authorized token for Student:", token);
            return NextResponse.next();
        }

        // Protected routes for admin and institution admin
        if (pathname.startsWith("/admin")) {
            if (!token || (token.role !== "ADMIN" && token.role !== "INSTITUTION_ADMIN")) {
                console.log("Unauthorized Access: No token or role mismatch for:", pathname);
                return NextResponse.redirect(new URL("/admin/login", req.url));
            }

            // Further differentiate between ADMIN and INSTITUTION_ADMIN
            if (pathname.startsWith("/admin/system") && token.role !== "ADMIN") {
                console.log("Unauthorized Access: Institution Admin trying to access System Admin route:", pathname);
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }

            console.log("Access granted to /admin");
            return NextResponse.next();
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const config = {
    matcher: ['/admin/:path*', '/student/:path*'],
};