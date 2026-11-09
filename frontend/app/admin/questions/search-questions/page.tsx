

import AdminHeader from "@/components/navigation/AdminHeader"
import SearchQuestionsClient from "@/components/admin/questions/SearchQuestionsClient"
import { buttonStyle } from "@/components/ui/buttons/buttonStyle"

export default function Page() {

    
    return (
        <div className="flex flex-col gap-y-1">
            <AdminHeader
                title="Search Questions"
                subtitle=""
                actions = {
                    <>
                    </>
                }
            />

            <div aria-hidden className="h-18" />

            <SearchQuestionsClient/>

        </div>
    )
}