import PracticeSidebar from "@/components/navigation/sidebar/practice/PracticeSidebar";



export default function PracticeLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="w-full px-2 md:px-6 lg:px-8">
            <div className="flex pt-2 sm:gap-x-2 md:gap-x-4">
                <aside className="hidden md:block w-64">
                    <PracticeSidebar/>
                </aside>
                <main className="flex-1 min-w-0 h-full">
                    {children}
                </main>
            </div>
        </div>
    );
}