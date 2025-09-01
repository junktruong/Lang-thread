import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"



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
