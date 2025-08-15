"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@prisma/client";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    if (!session) {
      router.push("/auth/signin");
    } else {
      setShowForm(true);
    }
  };

  async function handleSubmit() {
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, meaning }),
    });
    setShowForm(false);
    setWord("");
    setMeaning("");
    // Reload posts
    const res = await fetch("/api/posts");
    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Button onClick={handleCreatePost}>Tạo bài viết</Button>
        </div>

        {showForm && (
          <div className="space-y-4 border p-4 rounded">
            <Input
              placeholder="Word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            <Textarea
              placeholder="Meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
            />
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        )}

        {posts.length === 0 ? (
          <p className="text-gray-500">Chưa có bài viết nào.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/post/${post.id}`)}
              >
                <CardHeader>
                  <CardTitle>{post.word}</CardTitle>
                  <div className="text-xs text-gray-400">
                    {post.authorId ?? "Ẩn danh"} •{" "}
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
          </div>
        )}
      </main>
    </>
  );
}
