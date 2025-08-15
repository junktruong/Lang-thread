import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
    const posts = await db.post.findMany({
        include: { author: true, comments: true },
        orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(posts)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { word, meaning, mediaUrl, mediaType } = await req.json()
    const post = await db.post.create({
        data: {
            word,
            meaning,
            mediaUrl,
            mediaType,
            authorId: session.user.id
        }
    })
    return NextResponse.json(post)
}
