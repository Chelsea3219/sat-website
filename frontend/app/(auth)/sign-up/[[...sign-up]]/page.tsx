import { SignUp } from '@clerk/nextjs'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



export default async function SignUpPage() {
    const { isAuthenticated } = await auth();

    if (isAuthenticated) {
        redirect("/register");
    }

    return (
        <div className="flex min-h-dvh items-center justify-center px-4">
            <SignUp />
        </div>
    )
}


