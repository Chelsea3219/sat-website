import "../../styles/admin-sidebar.css"
import Link from 'next/link'
export default function AdminSidebar() {
    return (
        <>
            <div className="fixed w-48 top-16 h-[calc(100vh-64px)] bg-white border-r border-t border-black">
                <div className="admin-topics flex flex-col items-start mt-6">
                    <header>Questions</header>
                    <div className=" flex flex-col items-start pl-4">
                        <Link href="/admin/questions/upload-questions" className="subsection">Upload Questions</Link>
                        <Link href="/admin/questions/add-questions" className="subsection">Add Questions</Link>
                        <Link href="/admin/questions/edit-questions" className="subsection">Edit Questions</Link>
                        <Link href="/admin/questions/search-questions" className="subsection">Search Questions</Link>
                    </div>
                </div>

                <div className="admin-topics flex flex-col items-start mt-6">
                    <header>Students</header>
                    <div className=" flex flex-col items-start pl-4">
                        <Link href="/students/search-students" className="subsection">Search Students</Link>
                        <Link href="/students/student-performance" className="subsection">Student Performance</Link>
                    </div>
                </div>

                <div className="admin-topics flex flex-col items-start mt-6">
                    <header>Finance</header>
                    <div className=" flex flex-col items-start pl-4">
                        <Link href="/finance/monthly-revenue" className="subsection">Monthy Revnue </Link>
                        <Link href="/finance/monthy-costs" className="subsection">Monthy Costs</Link>
                        <Link href="/finance/projections" className="subsection">Projections</Link>
                    </div>
                </div>
            </div>
        </>
    )
}