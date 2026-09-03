import QuizClient from "@/components/dashboard/QuizClient"

type PageProps = {
    params: Promise<{section: string}>
}
export default async function Page({params}:PageProps) {

    const {section} = await params
    const activeTab = section.toLowerCase() === "math" ? "Math" : "Reading"

    return (
        <>
            <QuizClient
                section={section}
                activeTab={activeTab}
            />
        </>
    )
}