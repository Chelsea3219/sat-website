
import "../../styles/practice-sidebar.css"
import Link from 'next/link'
import {usePathname} from "next/navigation";


export default function ProfileSidebar() {
    const pathname = usePathname(); // grabs the current URL path 
   
    return (
        <>
            <div className="w-30 h-[calc(100vh-64px)] bg-white">
                <div className="flex flex-col gap-y-4 text-right mr-4">
                    <Link
                        href="/dashboard/profile/account"
                        className={`profile-sidebar-header ${pathname.startsWith("/dashboard/profile/account") ? "active" : ""}`}
                    >
                        Account
                    </Link>
                    <Link 
                        href="/dashboard/profile/learning" 
                        className={`profile-sidebar-header ${pathname.startsWith("/dashboard/profile/learning") ? "active" : ""}`}
                    >
                        Learning
                    </Link>
                    <Link 
                        href="/dashboard/profile/billing" 
                        className={`profile-sidebar-header ${pathname.startsWith("/dashboard/profile/billing") ? "active" : ""}`}
                    >
                        Billing
                    </Link>
                    <Link 
                        href="/dashboard/profile/settings"
                        className={`profile-sidebar-header ${pathname.startsWith("/dashboard/profile/settings") ? "active" : ""}`}
                    >
                        Settings
                    </Link>
                </div>

            </div>
        </>
    )
}