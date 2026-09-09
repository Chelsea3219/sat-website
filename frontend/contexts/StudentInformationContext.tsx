"use client"

import { createContext, useContext, ReactNode } from "react"
import useStudentInformation from "@/hooks/useStudentInformation";
import { useAuth } from "@clerk/nextjs"

function useUserInformation() {
    const {userId, isLoaded} = useAuth();

    const studentInformation = useStudentInformation(userId)

    return {...studentInformation, isLoaded}
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