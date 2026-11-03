// lib/auth/requireAdmin.ts
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {NextResponse } from 'next/server'


export async function requireAdmin() {
    const { userId, sessionClaims } = await auth.protect()   // signed-out users go to sign-in
    if (sessionClaims?.role !== "admin") redirect("/")
    return userId
}



type RouteContext<P> = { params: Promise<P> }
type AdminAuth = { token: string; userId: string }

export function withAdmin<P = Record<string, string>>(
    handler: (req: Request, ctx: RouteContext<P>, admin: AdminAuth) => Promise<Response>,
) {
    return async (req: Request, ctx: RouteContext<P>) => {
        const { userId, sessionClaims, getToken } = await auth()

        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        // Use the same claim name as your session token customization
        if (sessionClaims?.role !== "admin") {
            return NextResponse.json({ error: "Admins only" }, { status: 403 })
        }

        const token = await getToken()
        if (!token) return NextResponse.json({ error: "Missing authentication token" }, { status: 401 })

        return handler(req, ctx, { token, userId })
    }
}