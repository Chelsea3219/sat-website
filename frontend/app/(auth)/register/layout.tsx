import { UserInformationProvider } from "@/contexts/StudentInformationContext"



export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <UserInformationProvider>{children}</UserInformationProvider>
}