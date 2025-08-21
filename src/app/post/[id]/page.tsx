"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { usePostStore, Post } from "@/store/postStore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PostDetailPage() {
    const { id } = useParams()
    const { posts, addPost } = usePostStore()
    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<any[]>([])
    const [commentContent, setCommentContent] = useState("")

    // Lấy post từ store nếu có
    useEffect(() => {
        if (!id) return
        const found = posts.find((p) => p.id === id)
        console.log("posts in store:", posts);

        if (found) {
            setPost(found)
            console.log("Post found in store:", found);

        } else {
            // fallback fetch khi refresh trực tiếp
            fetch(`/api/posts/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setPost(data)
                    addPost(data)
                })

            console.log("Post fetched from API:", post);
        }

    }, [id])

    // Fetch comments
    useEffect(() => {
        if (!id) return
        fetch(`/api/comments/${id}`)
            .then((res) => res.json())
            .then((data) => setComments(data.comments))
    }, [id])

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return
        const res = await fetch(`/api/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: id, content: commentContent }),
        })
        if (res.ok) {
            const newComment = await res.json()
            setComments([...comments, newComment])
            setCommentContent("")
        }
    }

    return (
        <main className="max-w-2xl mx-auto p-4 space-y-6">
            {post ? (
                <Card>
                    <CardHeader className="flex flex-row gap-3 items-center">
                        <Avatar>
                            <AvatarImage src={post.author?.image || ""} />
                            <AvatarFallback>{post.author?.name}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{post.author?.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-lg font-bold">{post.word}</h2>
                        <p className="text-muted-foreground mb-2">{post.meaning}</p>
                        {post.mediaType === "image" && (
                            <img src={post.mediaUrl || ""} alt={post.word} className="rounded-md w-full" />
                        )}
                        {post.mediaType === "video" && (
                            <video src={post.mediaUrl || ""} controls className="rounded-md w-full" />
                        )}
                        <p className="text-gray-600">
                            {comments.length} Comments
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
                    {comments.map((comment) => (
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
                </div>
            )}
        </main>
    )
}
