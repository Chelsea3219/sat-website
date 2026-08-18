"use client"

import { useState } from "react"
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
    const [open, setOpen] = useState(defaultOpen)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get("tab") ?? "Review"

    const hasChildren = item.children && item.children.length > 0

    // ROOT NODES (Reading / Math)
    if (item.title === "Reading" || item.title === "Math") {
        return (
            <div className="mb-4">
                {item.children?.map((child, index: number) => (
                    <PracticeSidebarItem
                        key={index}
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
                    onClick={() => setOpen(!open)}
                >
                    <div>
                        {open ? <ChevronDown /> : <ChevronRight />}
                    </div>

                    <span>{item.title}</span>
                </div>

                {open && (
                    <div>
                        {item.children?.map((child, index: number) => (
                            <PracticeSidebarItem
                            key={index}
                            item={child}
                        />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    // LEAF NODE
    return (
        <div className="sidebar-leaf ml-4">
            {item.path ? (
                <Link
                    href={`/dashboard/practice/${item.path}?tab=${activeTab}`}
                    className={
                    pathname === item.path
                        ? "text-accent font-semibold" : "text-slate-900 hover:text-accent hover:font-semibold transition-colors"
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