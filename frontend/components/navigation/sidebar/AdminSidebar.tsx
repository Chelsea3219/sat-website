import "@/css/navigation/admin-sidebar.css"
import Link from 'next/link'
import { usePathname } from "next/navigation"

type SidebarLink = {
    label: string 
    href: string
}
const adminSidebarData: {title: string, links: SidebarLink[] }[] = [

    {
        title: "Questions",
        links: [
            {label: "Upload Questions", href:"/admin/questions/upload-questions"},
            {label: "Add Questions", href:"/admin/questions/add-questions"},
            {label: "Edit Questions", href:"/admin/questions/edit-questions"},
            {label: "Search Questions", href:"/admin/questions/search-questions"}
        ]
    }, 

    {
        title: "Students",
        links: [
            {label: "Search Students", href:"/admin/students/search-students"},
            {label: "Student Performance", href:"/admin/students/students-performance"}
        ]
    }, 

    {
        title: "Finance",
        links: [
            {label: "Monthly Revenue", href:"/admin/finance/monthly-revenue"},
            {label: "Monthly Costs", href:"/admin/finance/monthly-costs"},
            {label: "Projections", href:"/admin/finance/projections"},
        ]
    }, 
]

export default function AdminSidebar() {
    const pathname = usePathname() // grabs the current URL path

    return (
        <>
            <div className="fixed w-44 top-16 h-[calc(100vh-64px)] bg-white border-r border-t border-black">
                <div>
                    {adminSidebarData.map(section => (
                        <div key={section.title} className="admin-topics mt-6">
                            <header>{section.title}</header>
                            <div className="ml-4">
                                {section.links.map(link => {
                                    const isActive = pathname.startsWith(link.href)
                                    return (
                                        <div key={link.href}>
                                            <Link
                                                href={link.href}
                                                className={`subsection ${isActive ? "active" : ""}`}
                                            >
                                                {link.label}
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}