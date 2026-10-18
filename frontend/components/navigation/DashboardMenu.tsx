import { Home, BookOpen, ChartNoAxesColumnIncreasing, UserRound, ClipboardClock, LogOut } from "lucide-react"
import {SignOutButton} from "./SignOutButton";
import {usePathname} from "next/navigation";
import Link from "next/link";


const links = [
    { title:"Home", href:"/dashboard", Icon: Home}, 
    { title:"Practice", href:"/dashboard/practice", Icon: BookOpen}, 
    { title:"Progress", href:"/dashboard/progress", Icon: ChartNoAxesColumnIncreasing}, 
    { title:"Quiz", href:"/dashboard/quiz", Icon: ClipboardClock}, 
    { title:"Profile", href:"/dashboard/profile", Icon: UserRound}, 
]

export default function DashboardMenu({onNavigate}:{onNavigate?: () => void}) {
    const pathName = usePathname()

    const isActive = (href: string) =>
        href === "/dashboard" ? pathName === "/dashboard" : pathName.startsWith(href);

    return (

        <>

            <div className="bg-white rounded-lg p-2 w-full">
                {/* Links */}
                {links.map((link) => (

                    <Link
                        key = {link.href}
                        href = {link.href}
                        onClick={onNavigate}
                        className={`
                            flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors
                            ${isActive(link.href)
                                ? "bg-secondary font-semibold"
                                : "text-gray-700 hover:text-primary hover:font-bold "
                            }`}
                    >
                        <link.Icon className="w-4 h-4" strokeWidth={2}/>
                        {link.title}
                    </Link>
                ))}

                {/* Border */}
                <div className="border-b text-gray-200 my-2"/>
                <div className="flex flex-row items-center px-4 py-2 gap-3 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4 text-red-600" strokeWidth={2}/>
                    <SignOutButton className="text-sm text-red-600 hover:font-semibold"/>
                </div>
            </div>

        
        </>
    )
}