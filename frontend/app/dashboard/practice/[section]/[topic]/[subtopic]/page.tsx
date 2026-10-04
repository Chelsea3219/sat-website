

import PracticeClient from "@/components/dashboard-client/PracticeClient"

type Tab  = "Review" | "Questions" | "Answer"

type PageProps = {
    userId: string
    isLoaded: boolean
    params: Promise<{section: string, topic:string, subtopic:string}>
    searchParams: Promise<{tab?:string}>
}

// Just the server side, only await things
export default async function Page({params, searchParams}: PageProps) {
    const {section, topic, subtopic} = await params
    const {tab} = await searchParams
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