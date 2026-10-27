"use client"

import { createContext, useContext, ReactNode } from "react"
import useStudentInformation from "@/hooks/useStudentInformation";
import { useAuth } from "@clerk/nextjs"



function useUserInformation() {
    const {isLoaded, sessionId, isSignedIn} = useAuth();

    const studentInformation = useStudentInformation(isLoaded, isSignedIn)

    return {...studentInformation, isLoaded, sessionId, isSignedIn}
}

type UserInformationContextType = ReturnType<typeof useUserInformation>

const UserInformationContext = createContext<UserInformationContextType | null>(null)

export function UserInformationProvider({ children }: { children: ReactNode }) {
    const data = useUserInformation()
    
    return (
        <UserInformationContext.Provider value={data}>
            {children}
        </UserInformationContext.Provider>
    )
}

export function useUserInformationContext() {
    const ctx = useContext(UserInformationContext)
    if (!ctx) {
        throw new Error("useUserInformationContext must be used within a UserInformationProvider")
    }
    return ctx
}