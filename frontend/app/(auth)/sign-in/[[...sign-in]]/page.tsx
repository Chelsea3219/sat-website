import { SignIn } from '@clerk/nextjs'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function SignInPage() {
    const { isAuthenticated } = await auth();

    if (isAuthenticated) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-dvh items-center justify-center px-4">
            <SignIn />
        </div>
    );
}