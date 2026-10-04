import UploadQuestions from "@/components/forms/UploadQuestions";
import AdminHeader from "@/components/navigation/AdminHeader";

export default function Page () {

    return (
    <>
        <div className="w-full h-full pt-20">
            <AdminHeader title="Upload Questions" />
            <UploadQuestions/>
        </div>

            
    </>
    )
}