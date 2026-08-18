import Image from "next/image"
import '@/css/forms/form.css'
import useRegistration from "@/hooks/useRegistration";
import ErrorMessage from "@/components/ui/ErrorMessage";


export default function RegisterUser() {

    const uploader = useRegistration()

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
            <div className="flex p-2">

                {/* Left-side Image */}
                <div className="hidden sm:block flex-1 flex-col justify-center items-center">
                    <Image
                        src="/registration_image.png"
                        alt="Registration Visual"
                        width={1500} height={1500}
                        className="w-full h-auto"
                    />
                    <a
                        href="https://storyset.com/education"
                        className="flex justify-center text-xs text-gray-400"
                    >
                        Education illustrations by Storyset
                    </a>

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
                <div className="flex-1 p-4 ">

                    {/* Header */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <h1 className="flex flex-row space-x-1">
                            <Image
                                src="/marketing/landingpage_logo.svg"
                                alt="Elevate Learning"
                                width={32} height={32}
                                className="w-6 h-6 sm:w-8 sm:h-8"
                            />
                            <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary">Elevate Learning</span>
                        </h1>

                        <h2 className="text-sm sm:text-base md:text-lg font-semibold">Complete your profile</h2>
                    </div>

                    {/* form */}
                    <div className="space-y-2 w-full mb-4">
                        {/* Identification */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="input-group flex-1">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name = "first_name"
                                    onChange={uploader.fieldChange}
                                />
                            </div>

                            <div className="input-group flex-1">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name = "last_name"
                                    onChange={uploader.fieldChange}
                                />
                            </div>
                        </div>

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
                        <div className="flex flex-col sm:flex-row gap-4">
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
                        <div className="flex flex-col sm:flex-row gap-4">
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
                        <div className="flex flex-col sm:flex-row gap-4">
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

                        {/* Subscription*/}
                        <div className="input-group">
                            <label>Subscription</label>
                            <select
                                name="subscription"
                                onChange={uploader.fieldChange}
                            >
                                <option value="">Select Subscription</option>
                                <option value="free">Free</option>
                                <option value="starter">Starter</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        {/* Daily AND Weekly Learning Goals */}
                        <div className="flex flex-col sm:flex-row gap-4">
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
                    <button
                        type="button"
                        className="rounded-btn bg-primary text-white text-lg font-semibold"
                        onClick={handleSaveClick}
                        disabled={ !!uploader.error}
                    >
                        DONE
                    </button>

                </div>
            </div>
        </>
    )
}