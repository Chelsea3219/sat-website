"use client"


import useContactForm from '@/hooks/useContactForm'
import Image from "next/image"
import ErrorMessage from '@/components/ui/ErrorMessage'
import "@/css/forms/contact-form.css"

export default function ContactForm() {

    const {contactForm, fieldChange, uploadForm, error, setError} = useContactForm()
    const uploadFormClick = async () => {
        await uploadForm(contactForm)
    }

    return (
        <div>
            <section className="relative w-full">
                <div className="max-w-5xl mx-auto w-full px-4 flex flex-row space-x-2 items-center justify-center">

                    {/* Contact Us Form */}
                    <div className="flex-1 space-y-2 w-full">
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#5B55E8] mb-2 self-start">
                            Contact Us
                        </h1>

                        <div className="input-group">
                            <label>Full Name</label>
                            <input 
                                type="text"
                                name="full_name"
                                onChange={fieldChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input 
                                type="email"
                                name="email"
                                onChange={fieldChange}
                            />
                        </div>

                        <div className="flex flex-row space-x-2">
                            <div className="input-group">
                                <label>Role</label>
                                <select
                                    name="role"
                                    onChange={fieldChange}
                                >
                                    <option value="">Select a role</option>
                                    <option value="student">Student</option>
                                    <option value="parent">Parent</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Subject</label>
                                <select
                                    name="subject"
                                    onChange={fieldChange}
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general inquiry">General Inquiry</option>
                                    <option value="billing/subscription">Billing/Subscription</option>
                                    <option value="courses">Courses</option>
                                    <option value="web design">Web Design</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                onChange={fieldChange}
                                rows={4}
                            />
                        </div>

                        <button 
                            onClick={uploadFormClick}
                            className="rounded-btn bg-primary text-white mt-4">Send Message</button>
                    </div>

                    {/* Picture */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <Image
                            src="/marketing/contact-us.svg"
                            alt="Registration Visual"
                            width={2000} height={2000}
                            className="w-full max-w-lg h-auto object-contain" 
                        />
                        <a
                            href="https://storyset.com/education"
                            className="flex justify-center text-xs text-gray-400"
                        >
                            Education illustrations by Storyset
                        </a>
                        {/* Error message */}
                        {error &&
                            <div className="p-4">
                                <ErrorMessage
                                    error={error}
                                    onDismiss={() => setError("")}
                                />
                            </div>
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}