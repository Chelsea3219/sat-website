'use client'

import { useClerk } from '@clerk/nextjs'

export const SignOutButton = ({ className }: { className?: string }) => {
    const { signOut } = useClerk();
    return (
        // Clicking this button signs out a user
        // and redirects them to the home page "/".
        <button onClick={() => signOut({ redirectUrl: '/' })}
                className={className ?? "rounded-full"}
        >
            Logout
        </button>
    )
}