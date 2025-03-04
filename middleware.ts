import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const pathname = req.nextUrl.pathname;

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
            return NextResponse.next();
        }

        // Function to create redirect URL
        const createRedirectUrl = (path: string) => {
            const url = req.nextUrl.clone();
            url.pathname = path;
            return url;
        };

        // Handle student routes
        if (pathname.startsWith("/student")) {
            if (!token) {
                return NextResponse.redirect(createRedirectUrl("/student/login"));
            }

            if (token.role !== "STUDENT") {
                // Clear session and redirect to student login
                const response = NextResponse.redirect(createRedirectUrl("/student/login"));
                response.cookies.delete("next-auth.session-token");
                response.cookies.delete("next-auth.callback-url");
                response.cookies.delete("next-auth.csrf-token");
                return response;
            }
        }

        // Handle admin routes
        if (pathname.startsWith("/admin")) {
            if (!token || (token.role !== "ADMIN" && token.role !== "INSTITUTION_ADMIN")) {
                // Clear session and redirect to admin login
                const response = NextResponse.redirect(createRedirectUrl("/admin/login"));
                response.cookies.delete("next-auth.session-token");
                response.cookies.delete("next-auth.callback-url");
                response.cookies.delete("next-auth.csrf-token");
                return response;
            }

            // Further differentiate between ADMIN and INSTITUTION_ADMIN
            if (pathname.startsWith("/admin/system") && token.role !== "ADMIN") {
                return NextResponse.redirect(createRedirectUrl("/admin/dashboard"));
            }
        }

        // Enhanced session validation and role checking
        if (token) {
            const isAdminRoute = pathname.startsWith("/admin");
            const isStudentRoute = pathname.startsWith("/student");
            const isAdminUser = token.role === "ADMIN" || token.role === "INSTITUTION_ADMIN";
            const isStudentUser = token.role === "STUDENT";

            // Define auth-related cookies to clear
            const authCookies: string[] = [
                "next-auth.session-token",
                "next-auth.callback-url",
                "next-auth.csrf-token",
                "next-auth.pkce.code_verifier",
                "next-auth.pkce.state"
            ];

            // Helper function to clear auth cookies
            const clearAuthCookies = (response: NextResponse): void => {
                authCookies.forEach((cookie: string) => {
                    response.cookies.delete(cookie);
                });
            };

            // Prevent access to wrong section based on role
            if ((isAdminRoute && !isAdminUser) || (isStudentRoute && !isStudentUser)) {
                const redirectPath = isAdminRoute ? "/admin/login" : "/student/login";
                const response = NextResponse.redirect(createRedirectUrl(redirectPath));
                clearAuthCookies(response);
                return response;
            }

            // Additional security check for admin routes
            if (isAdminRoute) {
                // Ensure admin token has required fields
                if (!token.id || !token.email || !token.role) {
                    const response = NextResponse.redirect(createRedirectUrl("/admin/login"));
                    clearAuthCookies(response);
                    return response;
                }
            }

            // Additional security check for student routes
            if (isStudentRoute) {
                // Ensure student token has required fields including institution
                if (!token.id || !token.email || !token.role || !token.institutionId) {
                    const response = NextResponse.redirect(createRedirectUrl("/student/login"));
                    clearAuthCookies(response);
                    return response;
                }
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware Error:", error);
        // In case of error, redirect to home page
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public|images).*)',
    ],
};
