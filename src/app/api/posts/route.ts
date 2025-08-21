import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "5", 10);

    const posts = await db.post.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
            author: {
                select: { id: true, name: true, email: true, image: true },
            },
            comments: true,
        },
    });

    return NextResponse.json(posts);
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
