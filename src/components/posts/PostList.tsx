// components/posts/PostList.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePostStore } from "@/store/postStore";
import { Post } from "@prisma/client";

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
    const router = useRouter();
    const { posts, page, loading, setPosts, setLoading, nextPage } =
        usePostStore();
    const loaderRef = useRef<HTMLDivElement | null>(null);

    // fetch thêm bài viết khi scroll xuống
    const fetchPosts = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        const res = await fetch(`/api/posts?skip=${page * 5}&take=5`);
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data]);
            if (data.length > 0) nextPage();
        }
        setLoading(false);
    }, [page, loading, posts, setPosts, setLoading, nextPage]);

    // Initial load
    useEffect(() => {
        if (posts.length === 0) fetchPosts();
    }, []);

    // IntersectionObserver để lazy load khi scroll gần cuối
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    fetchPosts();
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [fetchPosts, loading]);

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <Card
                    key={post.id}
                    className="cursor-pointer hover:shadow-lg transition"
                    onClick={() => router.push(`/post/${post.id}`)}
                >
                    <CardHeader>
                        <CardTitle>{post.word}</CardTitle>
                        <div className="text-xs text-gray-400 flex gap-2 items-center">
                            {post.author?.image && (
                                <img
                                    src={post.author.image}
                                    alt={post.author.name || "user"}
                                    className="w-5 h-5 rounded-full"
                                />
                            )}
                            {post.author?.name ?? "Ẩn danh"} •{" "}
                            {new Date(post.createdAt).toLocaleString()}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            {post.meaning.length > 100
                                ? post.meaning.slice(0, 100) + "..."
                                : post.meaning}
                        </p>
                        {post.mediaUrl && (
                            <div className="mt-2">
                                {post.mediaType?.startsWith("image") ? (
                                    <img
                                        src={post.mediaUrl}
                                        alt="media"
                                        className="max-h-48 rounded"
                                    />
                                ) : (
                                    <a
                                        href={post.mediaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        Xem media
                                    </a>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
            <div ref={loaderRef} className="h-10 flex justify-center items-center">
                {loading && <p className="text-gray-400">Đang tải...</p>}
            </div>
        </div>
    );
}
