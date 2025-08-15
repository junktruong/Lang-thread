"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PostDetailPage() {
    const { id } = useParams()
    const [post, setPost] = useState<{
        author: { id: string; name: string; image: string; email: string }
        commentCount: number,
        word: string
        meaning: string
        mediaUrl?: string
        mediaType?: "image" | "video"
        createdAt: string
    } | null>(null)
    const [comments, setComments] = useState<
        {
            id: string;
            content: string;
            author: { id: string; name: string; image: string };
            createdAt: string;
            mediaUrl?: string
            mediaType?: "image" | "video"
        }[]
    >([])
    const [commentContent, setCommentContent] = useState("")

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return
        const res = await fetch(`/api/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: id, content: commentContent })
        })
        if (res.ok) {
            const newComment = await res.json()
            setComments([...comments, newComment])
            setCommentContent("")
        } else {
            console.error("Failed to add comment")
        }
    }

    useEffect(() => {
        // Lấy thông tin bài post
        const fetchPost = async () => {
            const res = await fetch(`/api/posts/${id}`)
            if (res.ok) {
                const data = await res.json()
                setPost(data)
            }
        }
        // Lấy danh sách comment theo id bài post
        const fetchComments = async () => {
            const res = await fetch(`/api/comments/${id}`)
            if (res.ok) {
                const data = await res.json()
                setComments(data.comments)
            }
        }
        if (id) {
            fetchPost()
            fetchComments()
        }
    }, [id])

    return (
        <main className="max-w-2xl mx-auto p-4 space-y-6">
            {post ? (
                <Card>
                    <CardHeader className="flex flex-row gap-3 items-center">
                        <Avatar>
                            <AvatarImage src={post.author.image} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{post.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-lg font-bold">{post.word}</h2>
                        <p className="text-muted-foreground mb-2">{post.meaning}</p>
                        {post.mediaType === "image" && (
                            <img src={post.mediaUrl} alt={post.word} className="rounded-md w-full" />
                        )}
                        {post.mediaType === "video" && (
                            <video src={post.mediaUrl} controls className="rounded-md w-full" />
                        )}
                        <p className="text-gray-600">
                            Số lượng bình luận: {post.commentCount}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <p className="text-gray-500">Không tìm thấy bài viết.</p>
            )}
            <Separator />

            {/* Comment form */}
            <div className="flex gap-2">
                <Input
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                />
                <Button onClick={handleCommentSubmit}>Send</Button>
            </div>

            {/* Comments */}
            {comments.length === 0 ? (
                <p className="text-gray-500">Chưa có bình luận nào.</p>
            ) : (
                <div className="space-y-3">
                    {comments.map(comment => (
                        <Card key={comment.id}>
                            <CardHeader className="flex flex-row gap-3 items-center">
                                <Avatar>
                                    <AvatarImage src={comment.author.image} />
                                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{comment.author.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>{comment.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>)}
        </main>
    )
}
