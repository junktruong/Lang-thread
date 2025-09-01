"use client"

import { Post } from "@/store/postStore"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function PostCard({ post }: { post: Post }) {
    const { data: session } = useSession()
    const router = useRouter()

    const handleClick = () => {
        if (!session) {
            router.push("/login")
        } else {
            router.push(`/post/${post.id}`)
        }
    }

    return (
        <div
            onClick={handleClick}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
        >
            <h2 className="font-semibold">{post.word}</h2>
            <p className="text-sm text-gray-500">{post.meaning}</p>
            {post.mediaUrl && (
                <Image
                    src={post.mediaUrl}
                    alt={post.word}
                    className="mt-2 rounded-lg object-cover max-h-60 w-full"
                />
            )}
        </div>
    )
}
