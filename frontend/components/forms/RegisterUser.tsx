import Image from "next/image"
import '@/css/forms/form.css'
import useRegistration from "@/hooks/useRegistration";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Check } from "lucide-react";
import { Fragment } from "react";

const registerSteps = [
    {
        label: "Purchase", 
        shortLabel: "Purchase", 
        sucess:true
    }, 
    {
        label: "Complete Profile", 
        shortLabel: "Profile", 
        sucess:false
    }, 
    {
        label: "Practice Questions", 
        shortLabel: "Practice",
        sucess:false
    }
]
export default function RegisterUser() {

    const uploader = useRegistration()
    if (!uploader) return 

    const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "International"]

    const handleSaveClick = async () => {
        await uploader.handleSave()
    }
    

    return (
        <>
            <div className="flex p-4">

                {/* Left-side Image */}
                <div className="hidden md:flex flex-1 flex-col justify-center items-center">
                    <h1 className="flex flex-row justify-center items-center space-x-1">
                        <Image
                            src="/marketing/landingpage_logo.svg"
                            alt="PrepForward"
                            width={32} height={32}
                            className="w-6 h-6 sm:w-12 sm:h-12"
                        />
                        <span className="text-3xl sm:text-4xl md:text-5xl font-semibold text-main tracking-wide ">PrepForward</span>
                    </h1>
                    <div className="px-12 mt-8">
                        <Image
                            src="/registration_image.png"
                            alt="Registration Visual"
                            width={900} height={900}
                            className="w-full h-auto"
                        />
                        <a
                            href="https://storyset.com/education"
                            className="flex justify-center text-xs text-gray-400"
                        >
                            Education illustrations by Storyset
                        </a>
                    </div>

                    {/* Error message */}
                    {uploader.error &&
                        <div className="p-4">
                            <ErrorMessage
                                error={uploader.error}
                                onDismiss={() => uploader.setError("")}
                            />
                        </div>
                    }
                </div>

                {/* Registration Field */}
                <div className="flex-1 p-8">

                    {/* Header */}
                    <div className="mb-6 space-y-3">
                        {/* Progress steps */}
                        <ol aria-label="Registration progress" className="flex items-center gap-2">
                            {registerSteps.map((step, index) => (
                                <Fragment key={index}>
                                    {/* Divider before every step except the first */}
                                    {index > 0 && (
                                        <li
                                            aria-hidden="true"
                                            className="h-0.5 w-full flex-1 rounded-full bg-primary"
                                        />
                                    )}
                                    <li
                                        className="flex shrink-0 items-center gap-2 text-main"
                                        aria-current="step"
                                    >                                         
                                        {step.sucess 
                                            ? (
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                                    <Check
                                                        strokeWidth={3}
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                </span> 
                                            ): <p className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white text-sm font-semibold text-primary">{index+1}</p>
                                        }
                                        <span className={`text-xs font-semibold sm:text-sm md:text-base ${step.sucess ? `text-primary`: ``}`}>
                                            <p className="hidden md:inline">{step.label}</p>
                                            <p className="md:hidden">{step.shortLabel}</p>
                                        </span>
                                </li>
                                </Fragment>
                            ))}

                        </ol>

                        <p className="text-base text-center text-gray-500">
                            Finish your profile below so we can build your study plan around your test date and goals.
                        </p>
                    </div>

                    {/* form */}
                    <div className="space-y-4 w-full mb-8">
                        {/* Identification TODO add an entry for a nickname or something else */}
                        

                        {/* Demographics */}
                        <div className="input-group flex-1">
                            <label>High School</label>
                            <input
                                type="text"
                                name = "school"
                                onChange={uploader.fieldChange}
                            />
                        </div>

                        {/* Classification */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="input-group flex-1">
                                <label>State</label>
                                <select
                                    name="state"
                                    onChange={uploader.fieldChange}
                                >
                                    <option value="">Select State</option>
                                    {states.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                        ))}
                                </select>
                            </div>

                            <div className="input-group flex-1">
                                <label>Grade Level</label>
                                <select
                                    name="grade_level"
                                    onChange={uploader.fieldChange}
                                >
                                    <option value="">Select Grade</option>
                                    <option value="9">9th Grade</option>
                                    <option value="10">10th Grade</option>
                                    <option value="11">11th Grade</option>
                                    <option value="12">12th Grade</option>
                                    <option value="adult">Adult</option>
                                </select>
                            </div>

                        </div>

                        {/* Original and Dream Score*/}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="input-group flex-1">
                                <label>Original Score</label>
                                <input
                                    type="number"
                                    name="original_score"
                                    onChange={uploader.fieldChange}
                                    placeholder="400 - 1600"
                                    min={400}
                                    max={1600}
                                />
                            </div>
                            <div className="input-group flex-1">
                                <label>Reading Score</label>
                                <input
                                    type="number"
                                    name="reading_score"
                                    onChange={uploader.fieldChange}
                                    placeholder="200 - 800"
                                    min={200}
                                    max={800}
                                />
                            </div>

                            <div className="input-group flex-1">
                                <label>Math Score</label>
                                <input
                                    type="number"
                                    name="math_score"
                                    onChange={uploader.fieldChange}
                                    placeholder="200 - 800"
                                    min={200}
                                    max={800}
                                />
                            </div>
                        </div>

                        {/* Dream Score and Test Date */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="input-group flex-1">
                                <label>Dream Score</label>
                                <input
                                    type="number"
                                    name="dream_score"
                                    onChange={uploader.fieldChange}
                                    placeholder="400 - 1600"
                                    min={400}
                                    max={1600}
                                />
                            </div>

                            <div className="input-group flex-1">
                                <label>Test Date</label>
                                <input
                                    type="date"
                                    name="test_date"
                                    onChange={uploader.fieldChange}
                                />
                            </div>
                        </div>

                        {/* Daily AND Weekly Learning Goals */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="input-group">
                                <label>Daily Learning Target </label>
                                <input
                                    type="number"
                                    name="daily_goal"
                                    onChange={uploader.fieldChange}
                                    placeholder="minutes per day"
                                    min={0}
                                    max={120}
                                />
                            </div>

                            <div className="input-group">
                                <label>Weekly Learning Target </label>
                                <input
                                    type="number"
                                    name="weekly_goal"
                                    onChange={uploader.fieldChange}
                                    placeholder="hours per week"
                                    min={0}
                                    max={24}
                                />
                            </div>
                        </div>

                        {/* Referral */}
                        <div className="input-group">
                            <label>How did you hear about us?</label>
                            <select
                                name="referral"
                                onChange={uploader.fieldChange}
                            >
                                <option value="">Select Option</option>
                                <option value="google">Google</option>
                                <option value="social media">Social Media</option>
                                <option value="family/friends">Family or Friends</option>
                                <option value="school">School</option>
                                <option value="advertisement">Advertisement</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="flex justify-center items-center rounded-2xl p-2 bg-primary text-white text-lg font-semibold w-3/4 hover:scale-110 transition-all"
                            onClick={handleSaveClick}
                            disabled={ !!uploader.error}
                        >
                            DONE
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}