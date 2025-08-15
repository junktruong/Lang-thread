import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const post = await db.post.findUnique({
        where: { id: id },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true
                }
            },
            comments: true,

        }
    })
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })


    return NextResponse.json({
        author: post.author,
        commentCount: post.comments.length,
        word: post.word,
        meaning: post.meaning,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        createdAt: post.createdAt
    })
}