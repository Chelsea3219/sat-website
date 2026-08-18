
import Footer from '@/components/navigation/Footer';
import LandingNavbar from '@/components/navigation/LandingNavBar';

export default function MarketingLayout({children,}: { children: React.ReactNode; }) {
    return (
        <div className='flex flex-col min-h-screen w-full'>
            {/* NavBar */}
            <LandingNavbar />

            {/* Main Section */}
            <main className="flex-1 pt-18 w-full">  
                <div className='flex items-center justify-center'>
                    {children}
                </div>
            </main>
            

            {/* Footer */}
            <Footer/>
                               
        </div>
    );
}