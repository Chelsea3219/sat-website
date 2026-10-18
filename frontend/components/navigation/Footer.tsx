"use client"

import Image from "next/image";
import Link from "next/link";


export default function Footer() {

    const contactInformation = [
        { key: "Location", value: "Nutley, NJ, USA" },
        { key: "Email", value: "cdzebaze@gmail.com" },
        { key: "Phone Number", value: "1 (917) 892 8481" },
    ]

    const linkClass = "font-semibold text-md text-white hover:border-white hover:border-b-2 hover:scale-105 transition-all cursor-pointer"

    return (

        <section className="relative w-screen text-center mx-[-50vw] left-1/2 right-1/2">
            <footer className="w-full bg-primary/90  p-4">
                <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-10">
                    <div className="flex flex-col justify-between gap-y-4">

                        {/* Logo and Website Title */}
                        <div className="flex flex-row gap-x-1 items-center">
                            <Image src="/marketing/footer_logo.png" alt="PrepForward" width={100} height={100} className="hidden w-16 h-15 md:block"/>
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white whitespace-nowrap">PrepForward</span>
                        </div>

                        {/* Logo + Contact Information */}
                        <div className="flex flex-row justify-between">

                            {/* Contact Information */}
                            <div className="flex flex-col flex-1 w-full gap-y-1.5">
                                {contactInformation.map((contact) => (
                                    <div key={contact.key} className="flex flex-row justify-between text-white/80 gap-x-4 text-md">
                                        <span className="font-semibold uppercase text-white min-w-27.5 text-left">{contact.key}</span>
                                        <span className="text-white/80">{contact.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden md:flex flex-col flex-1 items-end gap-y-1.5">
                                <Link href="/" className={linkClass}>Home</Link>
                                <Link href="/about" className={linkClass}>About</Link>
                                <Link href="/pricing" className={linkClass}>Pricing</Link>
                                <Link href="/contact-us" className={linkClass}>Contact Us</Link>
                            </div>
                        </div>

                    </div>

                    {/* Divider + bottom bar */}
                    <div className="mt-6 text-center text-xs text-white/50">
                        © {new Date().getFullYear()} PrepForward All rights reserved.
                    </div>

                </div>
            </footer>
        </section>
    )
}