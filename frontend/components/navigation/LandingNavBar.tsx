"use client"

import {SignInButton, SignUpButton} from "@clerk/nextjs";
import {useState} from "react"
import {X, Menu} from 'lucide-react'
import Image from "next/image"
import Link from 'next/link';
import { usePathname } from "next/navigation";

export default function LandingNavbar() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    // Helper function to check if page is active
    const isActive = (path: string) => pathname === path 

    // Dynamic class generator 
    const linkClass = (path: string) => 
        `font-semibold transition-all cursor-pointer ${isActive(path)
            ? 'text-accent scale-120 font-bold border-b-3 border-accent px-1' // 'text-main rounded-full bg-secondary p-2' 
            : 'text-main hover:text-accent hover:scale-110'
        }`

        
    const buttonClass = "rounded-full text-md font-semibold min-w-20 px-2 border-2 border-primary text-primary hover:bg-accent hover:text-white hover:border-accent transition-all "
    
    return(
        <nav className=" fixed left-0 top-0 z-50 bg-white w-full">
            <div className="max-w-6xl mx-auto px-2 md:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:gap-x-8 md:gap-x-12 lg:gap-x-16">

                    {/* Logo and Website Title */}
                    <div className="flex flex-row gap-x-1 items-center">
                        <Image src="/marketing/landingpage_logo.svg" alt="PrepForward" width={32} height={32} className="w-10 h-10"/>
                        <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-main whitespace-nowrap">PrepForward</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex md:text-sm lg:gap-x-6 md:gap-x-4 items-center">
                        <Link href="/" className={linkClass('/')}>Home</Link>
                        <Link href="/about" className={linkClass('/about')}>About</Link>
                        <Link href="/pricing" className={linkClass('/pricing')}>Pricing</Link>
                        <Link href="/contact-us" className={linkClass('/contact-us')}>Contact Us</Link>
                    </div>

                    {/* Login and Register */}
                    <div className="hidden md:flex flex-row md:text-sm gap-x-2 items-center">
                        <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
                            <button className={buttonClass}>
                                Login
                            </button>
                        </SignInButton>
                        <Link 
                            href = "/pricing"
                            className={`${buttonClass} bg-primary text-white text-center`}>
                            Register 
                        </Link>
                    </div>


                    {/* Hamburger Menu */}
                    <button className="md:hidden p-2 text-slate-900 font-semibold hover:text-accent hover:font-semibold hover:scale-110 text-xl cursor-pointer"
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
                <div className="md:hidden top-full left-0 w-full border-t-2 border-gray-100 bg-white shadow-md animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col items-end p-4 space-y-3 text-xs font-semibold ">
                        <Link href="/"
                            onClick={() => setOpen(false)}
                            className={`${linkClass("/")} block origin-right `}
                        >
                            Home
                        </Link>

                        <Link href="/about"
                            onClick={() => setOpen(false)}
                            className={`${linkClass("/about")} block origin-right `}                        
                        >
                            About
                        </Link>

                        <Link href="/pricing"
                            onClick={() => setOpen(false)}
                            className={`${linkClass("/pricing")} block origin-right `}                        
                        >
                            Pricing
                        </Link>

                        <Link href="/contact-us"
                            onClick={() => setOpen(false)}
                            className={`${linkClass("/contact-us")} block origin-right `}                        
                        >
                            Contact Us
                        </Link>

                        <div className="flex flex-col items-end gap-y-3 w-24">
                            <SignInButton>
                                <button className={`${buttonClass} border-2`}>
                                    Login
                                </button>
                            </SignInButton>

                            <Link 
                                href = "/pricing"
                                className={`${buttonClass} bg-primary text-white`}>
                                Register 
                            </Link>
                        </div>
                    </div>
                </div>
            }
        </nav>
    )
}