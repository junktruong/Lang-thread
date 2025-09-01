import { db } from "@/lib/db"
import { NextResponse } from "next/server"


export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params
    const comments = await db.comment.findMany({
        where: { postId: postId },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        },
        orderBy: { id: "desc" }
    })
    return NextResponse.json({
        comments: comments.map(comment => ({
            author: comment.author,
            createdAt: comment.createdAt,
            id: comment.id,
            content: comment.content,
            mediaUrl: comment.mediaUrl,
            mediaType: comment.mediaType,
        }))
    })
}