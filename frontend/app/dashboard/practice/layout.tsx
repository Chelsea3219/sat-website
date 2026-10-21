import PracticeSidebar from "@/components/navigation/sidebar/practice/PracticeSidebar";



export default function PracticeLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="w-full bg-[#F8F9FC]">
            <div className="flex gap-x-4 pb-4 px-6 md:px-4 lg:px-2">
                <aside className="hidden md:block w-64 shrink-0">
                    <PracticeSidebar/>
                </aside>
                <main className="px-4 md:px-0 flex-1 min-w-0 h-full">
                    {children}
                </main>
            </div>
        </div>
    );
}