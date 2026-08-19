import QuizClient from "@/components/dashboard/QuizClient"
import * as sea from "node:sea"

type Tab = "Reading" | "Math"
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