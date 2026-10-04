"use client"

import { useState } from "react"
import AdminSidebar from "./sidebar/AdminSidebar"

import {
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react"

type HeaderProps = {
    title: string
    subtitle?: string
    actions?: React.ReactNode
}

export default function AdminHeader({title, subtitle, actions}: HeaderProps) {

    const [open, setOpen] = useState(false)

    return (
        <>
            {/* HEADER */}
            <header className="fixed top-0 left-0 z-40 w-full bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="h-16 flex items-center justify-between">

                        {/* LEFT */}
                        <div className="flex items-center gap-2">

                            <div className = "relative">
                                {/* SIDEBAR TOGGLE */}
                                <button
                                    onClick={() => setOpen(prev => !prev)}
                                    className="p-2 rounded-lg hover:bg-slate-100 transition"
                                >
                                    {open
                                        ? <PanelLeftClose className="w-10 h-10" />
                                        : <PanelLeftOpen className="w-10 h-10" />
                                    }
                                </button>

                                {/* SIDEBAR */}
                                {open && (
                                    <div
                                        className=" absolute top-full mt-2 z-30 w-120 p-4"
                                    >
                                        <AdminSidebar />
                                    </div>
                                )}
                            </div>

                            {/* TITLE */}
                            <div>
                                <h1
                                    className="text-xl sm:text-2xl lg:text-3xl font-bold"
                                >
                                    {title}
                                </h1>

                                {subtitle && (
                                    <p
                                        className="text-sm text-slate-500"
                                    >
                                        {subtitle}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* ACTIONS */}
                        <div>
                            {actions}
                        </div>

                    </div>

                </div>

            </header>
        </>
    )
}