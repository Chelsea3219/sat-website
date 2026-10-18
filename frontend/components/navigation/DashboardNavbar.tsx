"use client"

import {SignOutButton} from "./SignOutButton";
import {useState} from "react"
import {X, Menu, PanelTopOpen, PanelTopClose} from 'lucide-react'
import Image from "next/image"
import Link from 'next/link';
import {usePathname} from "next/navigation";
import PracticeSidebar from "./sidebar/practice/PracticeSidebar";
import DashboardMenu from "./DashboardMenu";

export default function DashboardNavbar() {
    const [open, setOpen] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

    const pathName = usePathname();
    const isPractice = pathName.startsWith("/dashboard/practice");

    const buttonClass = `
        px-2 py-1 rounded-full text-sm md:text-base font-semibold 
        bg-white text-primary
        hover:scale-110 hover:bg-red-50 hover:text-red-500 transition-all
    `

    const isActive = (href: string) =>
        href === "/dashboard" ? pathName === "/dashboard" : pathName.startsWith(href);
    const linkClass = (path: string) => 
        `text-white text-xs sm:text-sm md:text-base font-semibold ${isActive(path)
            ? 'scale-105 font-bold border-b-2 border-white px-1' // 'text-main rounded-full bg-secondary p-2' 
            : 'hover:text-accent hover:scale-115 transition-all'
        }`
    
    return(
        <nav className=" fixed left-0 top-0 z-50 bg-primary w-full">
            <div className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:gap-x-10 md:gap-x-12 lg:gap-x-16">

                    {/* Logo and Website Title */}
                    <div className="flex flex-row gap-x-1 items-center">
                        <Image src="/dashboard/dashboard_logo1.svg" alt="PrepForward" width={32} height={32} className="hidden md:block w-10 h-10"/>
                        {isPractice && (
                            <button className="md:hidden p-1 text-white font-bold hover:text-accent hover:scale-115 text-xl cursor-pointer"
                                    onClick={() => {
                                        setOpenSidebar((prev) => !prev);
                                        setOpen(false)
                                    }}
                            >
                                {/* Checks to see if the mobileMenu is open */}
                                {openSidebar ?
                                    (
                                        <PanelTopClose className="w-6 h-6"/>
                                    ) : (
                                        <PanelTopOpen className="w-6 h-6"/>
                                )}
                            </button>
                        )}
                        <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white whitespace-nowrap">PrepForward</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex md:text-sm lg:gap-x-6 md:gap-x-4 items-center">
                        <Link href="/dashboard" className={linkClass('/dashboard')}>Home</Link>
                        <Link href="/dashboard/practice/" className={linkClass('/dashboard/practice/')}>Practice</Link>
                        <Link href="/dashboard/progress" className={linkClass('/dashboard/progress')}>Progress</Link>
                        <Link href="/dashboard/quiz/" className={linkClass('/dashboard/quiz/')}>Quiz</Link>
                        <Link href="/dashboard/profile/account" className={linkClass('/dashboard/profile')}>Profile</Link>
                        <SignOutButton className={buttonClass}/>
                        {/* rounded-btn text-md h-7 border-2 border-primary bg-primary text-white */}
                    </div>

                    {/* Hamburger Menu */}
                    <button 
                        className="md:hidden p-2 text-white font-semibold hover:text-accent hover:font-semibold hover:scale-110 text-xl cursor-pointer"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        {/* Checks to see if the mobileMenu is open */}
                        {open ? ( <X className="w-6 h-6"/>) : (
                            <Menu className="w-6 h-6"/>
                            )}
                    </button>
                </div>
            </div>

            {/* Mobile Navbar */}
            {open &&
                <div className="md:hidden top-full left-0 w-full bg-primary shadow-md animate-in slide-in-from-top-2 duration-300 fade-in px-4 pb-4">
                    <DashboardMenu onNavigate={()=> setOpen(false)}/>
                </div>
            }

            {/* Mobile Sidebar */}
            {openSidebar &&
                <div className="md:hidden absolute top-full left-0 w-full bg-primary animate-in slide-in-from-top transition-all duration-300">
                    <div className="flex justify-center pb-4 px-4 ">
                        <PracticeSidebar onNavigate={()=> setOpenSidebar(false)}/>
                    </div>
                </div>
            }
        </nav>
    )
}