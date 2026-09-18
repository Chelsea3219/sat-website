import DashboardNavbar from "@/components/navigation/DashboardNavbar";
import { auth } from "@clerk/nextjs/server";
import { UserInformationProvider } from "@/contexts/StudentInformationContext";



export default async function DashboardLayout({children}: {children: React.ReactNode}) {

    await auth.protect(); // Protects the pages under dashboard

    return (
        <UserInformationProvider>
            <div className='flex flex-col min-h-screen w-full'>
                {/* NavBar */}
                <DashboardNavbar />

                {/* Main Section */}
                <main className="flex-1 pt-20 w-full">  
                    <div className='max-w-6xl mx-auto w-full'>
                        {children}
                    </div>
                </main>
                
            </div>
        </UserInformationProvider>
    );
}