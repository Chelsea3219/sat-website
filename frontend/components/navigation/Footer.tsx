"use client"

import Image from "next/image";
import Link from "next/link";


export default function Footer() {

    const contactInformation = [
        { key: "Location", value: "Nutley, NJ, USA" },
        { key: "Email", value: "cdzebaze@gmail.com" },
        { key: "Phone Number", value: "1 (917) 892 8481" },
    ]

    const linkClass = "font-semibold text-md text-white hover:text-primary hover:bg-white hover:scale-105 transition-all cursor-pointer rounded-full px-3 py-1"

    return (

        <section className="relative w-screen text-center mx-[-50vw] left-1/2 right-1/2">
            <footer className="w-full bg-primary/90 mt-10 p-4">
                <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-10">
                    <div className="flex flex-col md:flex-row justify-between gap-10">

                        {/* Logo + Contact Information */}
                        <div className="flex flex-col gap-y-2">
                            {/* Logo and Website Title */}
                            <div className="flex flex-row gap-x-2 items-center">
                                <Image src="/marketing/footer_logo.png" alt="Elevate Learning" width={90} height={90} className="hidden w-full h-full md:block"/>
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white whitespace-nowrap">Elevate Learning</span>
                            </div>

                            {/* Contact Information */}
                            <div className="flex flex-col gap-y-1.5">
                                {contactInformation.map((contact) => (
                                    <div key={contact.key} className="flex flex-row justify-between text-white/80 gap-x-4 text-md">
                                        <span className="font-semibold uppercase text-white min-w-27.5 text-left">{contact.key}</span>
                                        <span className="text-white/80">{contact.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-1 flex-col items-start md:items-end gap-y-2">
                            <Link href="/" className={linkClass}>Home</Link>
                            <Link href="/about" className={linkClass}>About</Link>
                            <Link href="/pricing" className={linkClass}>Pricing</Link>
                            <Link href="/contact-us" className={linkClass}>Contact Us</Link>
                        </div>
                    </div>

                    {/* Divider + bottom bar */}
                    <div className="mt-6 text-center text-xs text-white/50">
                        © {new Date().getFullYear()} Elevate Learning. All rights reserved.
                    </div>

                </div>
            </footer>
        </section>
    )
}