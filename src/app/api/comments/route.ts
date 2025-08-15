import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { Session } from "@prisma/client"


export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    // Kiểm tra đăng nhập
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postId, content, mediaUrl, mediaType } = await req.json()

    // Kiểm tra dữ liệu hợp lệ
    if (!postId || !content?.trim()) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const comment = await db.comment.create({
        data: {
            content: content.trim(),
            mediaUrl,
            mediaType,
            postId,
            authorId: session.user.id, // 👈 Lấy từ session
        },
        include: {
            author: true, // Trả về luôn info user nếu cần
        }
    })

    return NextResponse.json(comment, { status: 201 })
}

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