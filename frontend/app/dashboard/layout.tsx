import DashboardNavbar from "@/components/navigation/DashboardNavbar";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({children}: {children: React.ReactNode}) {

    await auth.protect(); // Protects the pages under dashboard

    return (
        <div className='flex flex-col min-h-screen w-full'>
            {/* NavBar */}
            <DashboardNavbar />

            {/* Main Section */}
            <main className="flex-1 pt-18 w-full">  
                <div className='flex items-center justify-center'>
                    {children}
                </div>
            </main>
            
                                
        </div>
    );
}