"use client"

import { useAuth } from "@clerk/nextjs"
import { useCallback } from "react"

export type AuthedFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export function useAuthedFetch(): AuthedFetch {
    const { getToken } = useAuth()

    return useCallback<AuthedFetch>(async (input, init = {}) => {
        let res = await fetch(input, init)

        if (res.status === 401) {
            // Force Clerk to refresh the session cookie, then try once more
            await getToken({ skipCache: true })
            res = await fetch(input, init)
        }
        return res
    }, [getToken])
}