export { default } from "next-auth/middleware"

import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = new URL(req.url)

    // Cho phép truy cập trang đăng nhập và file tĩnh
    if (
        pathname.startsWith("/auth/signin") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next()
    }

    // Nếu chưa đăng nhập thì chuyển hướng về trang đăng nhập
    if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/post/new",    // chỉ user đăng nhập mới được đăng bài
        "/api/posts/:path*", // API post cần login
        "/api/comments/:path*"
    ],
}
