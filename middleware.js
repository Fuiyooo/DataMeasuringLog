import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Define the paths that require authentication
    const protectedPaths = ['/dashboard', '/profile', '/settings'];

    // Check if the request is for a protected path
    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

    if (isProtectedPath && !token) {
        // Redirect to the login page if the user is not authenticated
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Allow the request to proceed if the user is authenticated or the path is not protected
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'], // Define the paths to match
};