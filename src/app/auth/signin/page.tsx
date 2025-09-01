"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function SignInPage() {
    const { data: sesson, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/")
        }
    }, [status, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        </div>
    )
}
