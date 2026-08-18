import { SignIn } from '@clerk/nextjs'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function SignInPage() {
    const { isAuthenticated } = await auth();

    if (isAuthenticated) {
        redirect("/dashboard");
    }

    return (
       <div className="flex justify-center items-center">
            <div className="-mt-10">
                <SignIn/>
            </div>
        </div>
    );
}