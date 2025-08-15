"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NewPostPage() {
    const [word, setWord] = useState("")
    const [meaning, setMeaning] = useState("")
    const router = useRouter()

    async function handleSubmit() {
        await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word, meaning }),
        })
        router.push("/")
    }

    return (
        <main className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-xl font-bold">New Post</h1>
            <Input placeholder="Word" value={word} onChange={e => setWord(e.target.value)} />
            <Textarea placeholder="Meaning" value={meaning} onChange={e => setMeaning(e.target.value)} />
            <Button onClick={handleSubmit}>Submit</Button>
        </main>
    )
}
