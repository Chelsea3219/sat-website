import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST() {
    const guestId = process.env.GUEST_USER_ID;
    if (!guestId) return NextResponse.json({ error: "Guest login not configured" }, { status: 500 });

    try {
        const client = await clerkClient();
        const { token } = await client.signInTokens.createSignInToken({
            userId: guestId,
            expiresInSeconds: 60, // only needs to live long enough to be used
        });
        return NextResponse.json({ token });
    } catch (err) {
        console.error("guest token error: ", err);
        return NextResponse.json({ error: "Could not start the demo" }, { status: 500 });
    }
}