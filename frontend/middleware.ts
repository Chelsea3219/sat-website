// Grants authentication state throughout your app -- allows you to protect specify routes from unauthenticated register
import { clerkMiddleware } from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

const GUEST_BLOCKED_PATHS = ["/admin", "/dashboard/billing", "/register", "/dashboard/profile"];

export default clerkMiddleware(async (auth, req) => {
    const { sessionClaims } = await auth();
    const path = req.nextUrl.pathname;

    const isBlocked = GUEST_BLOCKED_PATHS.some(
        (blocked) => path === blocked || path.startsWith(`${blocked}/`)
    );

    if (sessionClaims?.metadata?.role === "guest" && isBlocked) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

        // Always run for API routes
        "/(api|trpc)(.*)",

        // Always run for Clerk frontend API routes
        "/__clerk/(.*)",
    ],
};
