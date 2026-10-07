// TODO: Implement webhook handling for Clerk session management, limiting active sessions per user.
// TODO Connect it in Clerk when you have establish your domain 


import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

const MAX_DEVICES = 2 // change to your limit

export async function POST(req: NextRequest) {
    let evt
    try {
        evt = await verifyWebhook(req) // checks the request really came from Clerk
    } catch {
        return new Response('Invalid signature', { status: 400 })
    }

    if (evt.type === 'session.created') {
        const userId = evt.data.user_id
        const client = await clerkClient()

        const { data: sessions } = await client.sessions.getSessionList({
        userId,
        status: 'active',
        limit: 100,
        })

        // Newest sessions first; keep MAX_DEVICES, sign out the rest
        const extra = [...sessions]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(MAX_DEVICES)

        await Promise.all(extra.map((s) => client.sessions.revokeSession(s.id)))
    }

    return new Response('OK', { status: 200 })
}