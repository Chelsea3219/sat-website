import PracticeSidebar from "@/components/navigation/sidebar/practice/PracticeSidebar";



export default function PracticeLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="w-full bg-[#F8F9FC]">
            <div className="flex space-x-4">
                <aside className="hidden md:block w-64 shrink-0">
                    <PracticeSidebar/>
                </aside>
                <main className="flex-1 min-w-0 h-full">
                    {children}
                </main>
            </div>
        </div>
    );
}