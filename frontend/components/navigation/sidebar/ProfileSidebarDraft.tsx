
import "../../styles/practice-sidebar.css"
import Link from 'next/link'
import {usePathname} from "next/navigation";


const sidebarSections = [
    {
        header: "Account",
        links: [
            { label: "Personal Information", href: "/dashboard/profile/account/personal-information" },
            { label: "SAT Goals & Test Date", href: "#" },
        ],
    },
    {
        header: "Learning",
        links: [
            { label: "Study Preferences", href: "#" },
            { label: "Learning Statistics", href: "#" },
            { label: "Test History", href: "#" },
            { label: "Achievements", href: "#" },
        ],
    },
    {
        header: "Billing",
        links: [
            { label: "Subscription", href: "#" },
            { label: "Invoice History", href: "#" },
        ],
    },
    {
        header: "Settings",
        links: [
            { label: "Notifications", href: "#" },
            { label: "Privacy & Security", href: "#" },
        ],
    },
]

export default function ProfileSidebarDraft() {
    const pathname = usePathname();

    return (
        <div className="fixed w-48 top-16 pt-6 pr-2 h-[calc(100vh-64px)] bg-white border-r border-secondary">
            <div className="flex flex-col gap-y-4">
                {sidebarSections.map((section) => (
                    <div key={section.header}>
                        <div className="profile-sidebar-header">{section.header}</div>
                        <div>
                            {section.links.map((link) => {
                                const isActive =
                                    link.href !== "#" &&
                                    (pathname === link.href || pathname.startsWith(`${link.href}/`))
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={`profile-sidebar-subheader ${isActive ? "active" : ""}`}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}