
import { redirect } from 'next/navigation'
import { isGuestAllowedSubtopic, GUEST_DEFAULT_PRACTICE_PATH } from '@/utils/guest'
import { auth } from '@clerk/nextjs/server'
import PracticeClient from "@/components/dashboard-client/PracticeClient"

type Tab  = "Review" | "Questions" | "Answer"

type PageProps = {
    params: Promise<{section: string, topic:string, subtopic:string}>
    searchParams: Promise<{tab?:string}>
}

// Just the server side, only await things
export default async function Page({params, searchParams}: PageProps) {

    // Extract the section, topic, and subtopic from the URL parameters
    const {section, topic, subtopic} = await params
    const {tab} = await searchParams

    // Prepares a different set of subtopics if role === "guest"
    const {sessionClaims} = await auth()
    if (sessionClaims?.metadata?.role === "guest" && !isGuestAllowedSubtopic(subtopic)) {
        // Redirect guest users to the default practice path if they try to access a locked subtopic
        return redirect(GUEST_DEFAULT_PRACTICE_PATH)
    }


    return (
        <>
            <PracticeClient
                section={section}
                topic={topic}
                subtopic={subtopic}
                activeTab={(tab ?? "Review") as Tab}
            />
        </>
    )
}