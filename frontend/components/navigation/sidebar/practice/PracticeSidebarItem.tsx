"use client"

import {useUser} from "@clerk/nextjs"
import { useState} from "react"
import {ChevronRight, ChevronDown, Lock} from "lucide-react";
import Link from "next/link"
import "@/css/navigation/practice-sidebar.css"
import {usePathname, useSearchParams} from "next/navigation";
import { isGuestAllowedSubtopic } from "@/utils/guest";

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

    const {user} = useUser()
    const isGuest = user?.publicMetadata?.role === "guest"

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
    const slug = item.path?.split("/").filter(Boolean).pop()
    const locked = isGuest && !isGuestAllowedSubtopic(slug)
    if (!item.title) return null 
    //console.log({ pathname, fullPath, isActive })
    return (
        <div className="sidebar-leaf ml-4">
            {item.path && !locked? (
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
                <span 
                    className={`flex items-center gap-1 ${locked ? "text-slate-400! cursor-not-allowed" : "text-slate-900"}`}
                    title={locked ? "Sign up to unlock this subtopic" : undefined}
                >
                    <div className="flex flex-row gap-x-2 items-center ">
                        {locked && <Lock className="w-3 h-3 shrink-0"/>}
                        {item.title}
                    </div>
                </span>
            )}
        </div>
    )
}