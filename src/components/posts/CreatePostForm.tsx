"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Post, usePostStore } from "@/store/postStore";
import ImageUploaderWithCrop from "@/components/ImageUpload/ImageUploadCrop";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase"; // file config firebase bạn đã tạo

export default function CreatePostForm({ session }: { session: any }) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [word, setWord] = useState("");
    const [meaning, setMeaning] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 👈 thêm state này

    const { addPost } = usePostStore();

    const handleCreatePost = () => {
        if (!session) {
            router.push("/auth/signin");
        } else {
            setShowForm(true);
        }
    };

    async function handleSubmit() {
        let mediaUrl = null;
        let mediaType = null;

        if (imageFile) {
            const storageRef = ref(storage, `posts/${Date.now()}-${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            mediaUrl = await getDownloadURL(storageRef);
            mediaType = imageFile.type;
        }

        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word, meaning, mediaUrl, mediaType }),
        });

        if (res.ok) {
            const data = await res.json();
            const newPost: Post = {
                id: data.id,
                word: data.word,
                meaning: data.meaning,
                createdAt: data.createdAt,
                mediaUrl: data.mediaUrl,
                mediaType: data.mediaType,
                authorId: data.authorId,
                author: session.user,
            };
            addPost(newPost); // luôn đẩy lên đầu
        }

        setShowForm(false);
        setWord("");
        setMeaning("");
        setImageFile(null);
    }

    return (
        <div className="space-y-4">
            <Button onClick={handleCreatePost}>Tạo bài viết</Button>

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

                    <ImageUploaderWithCrop
                        onImageCropped={(file, previewUrl) => {
                            setImageFile(file);
                            // hiển thị luôn trong form
                            setPreviewUrl(previewUrl);
                        }}
                    />

                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Selected"
                            className="w-48 h-48 object-cover rounded"
                        />
                    )}

                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            )}
        </div>
    );
}
