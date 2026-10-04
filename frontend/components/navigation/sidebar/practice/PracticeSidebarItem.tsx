"use client"

import { useState} from "react"
import {ChevronRight, ChevronDown} from "lucide-react";
import Link from "next/link"
import "@/css/navigation/practice-sidebar.css"
import {usePathname, useSearchParams} from "next/navigation";


type SidebarItem = {
    title: string
    path?: string
    children?: SidebarItem[]
}

type PracticeProps = {
    item: SidebarItem
    defaultOpen?: boolean
}

export default function PracticeSidebarItem({ item, defaultOpen = false }: PracticeProps) {

    // Normalize the full path 
    const BASE = "/dashboard/practice"
    const toFullPath = (path: string) => `${BASE}${path}`

    // Helper function to auto-expand the active branch 
    const containsPath = (item: SidebarItem, pathname: string): boolean =>
        (item.path != null && pathname === toFullPath(item.path)) ||
        (item.children?.some(child => containsPath(child, pathname)) ?? false)

    // Declare the parameters 
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get("tab") ?? "Review"

    // Open the sidebar 
    const [manualOpen, setManualOpen] = useState<boolean | null>(null)
    const isActiveBranch = containsPath(item, pathname)
    const open = manualOpen ?? (defaultOpen || isActiveBranch)

    const hasChildren = item.children && item.children.length > 0


    // ROOT NODES (Reading / Math)
    if (item.title === "Reading" || item.title === "Math") {
        return (
            <div className="mb-4">
                {item.children?.map((child) => (
                    <PracticeSidebarItem
                        key={child.title}
                        item={child}
                    />
                ))}
            </div>
        )
    }

    // BRANCH NODE
    if (hasChildren) {
        return (
            <div className="sidebar-item">
                <div
                    className="sidebar-subtitle flex items-center gap-1 cursor-pointer"
                    onClick={() => setManualOpen(!open)}
                >
                    <div>
                        {open ? <ChevronDown /> : <ChevronRight />}
                    </div>
                    <span>{item.title}</span>
                </div>

                {open && (
                    <div>
                        {item.children?.map((child) => (
                            <PracticeSidebarItem
                            key={child.title}
                            item={child}
                        />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    // LEAF NODE
    const fullPath = item.path ? toFullPath(item.path) : ""
    const isActive = pathname === fullPath
    //console.log({ pathname, fullPath, isActive })
    return (
        <div className="sidebar-leaf ml-4">
            {item.path ? (
                <Link
                    href={`${fullPath}?tab=${activeTab}`}
                    aria-current = {isActive ? "page" : undefined}
                    className={
                        isActive
                            ? "text-primary font-semibold text-[115%]" 
                            : "text-slate-900 hover:text-accent hover:font-semibold transition-colors"
                    }
                >
                    {item.title}
                </Link>
            ) : (
                <span className="text-slate-900">{item.title}</span>
            )}
        </div>
    )
}