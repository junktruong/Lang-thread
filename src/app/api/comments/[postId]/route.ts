import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { Session } from "@prisma/client"

export async function GET(req: Request, { params }: { params: { postId: string } }) {
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