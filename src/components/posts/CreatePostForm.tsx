"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Post, usePostStore } from "@/store/postStore";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreatePostForm({ session }: { session: any }) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [word, setWord] = useState("");
    const [meaning, setMeaning] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Camera states
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { addPost } = usePostStore();

    const handleCreatePost = () => {
        if (!session) {
            router.push("/auth/signin");
        } else {
            setShowForm(true);
        }
    };

    // Mở camera
    async function openCamera() {
        setIsCameraOpen(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }

    // Chụp ảnh từ camera
    function capturePhoto() {
        if (!videoRef.current || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx?.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob(
            (blob) => {
                if (blob) {
                    const file = new File([blob], `capture-${Date.now()}.png`, { type: "image/png" });
                    setImageFile(file);
                }
            },
            "image/png",
            1
        );
        setIsCameraOpen(false);
        // Tắt camera
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
    }

    // Chuyển sang WebP
    async function convertToWebP(file: File): Promise<Blob> {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0);
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                    },
                    "image/webp",
                    0.8
                );
            };
        });
    }

    async function handleSubmit() {
        let mediaUrl = null;
        let mediaType = null;

        if (imageFile) {
            const webpBlob = await convertToWebP(imageFile);
            const storageRef = ref(storage, `posts/${Date.now()}.webp`);
            await uploadBytes(storageRef, webpBlob);
            mediaUrl = await getDownloadURL(storageRef);
            mediaType = "image/webp";
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
            addPost(newPost);
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

                    {/* Upload ảnh từ file */}
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImageFile(e.target.files[0]);
                            }
                        }}
                    />

                    {/* Chụp ảnh */}
                    {!isCameraOpen && (
                        <Button type="button" onClick={openCamera}>
                            Mở camera
                        </Button>
                    )}
                    {isCameraOpen && (
                        <div className="space-y-2">
                            <video ref={videoRef} autoPlay className="w-full rounded" />
                            <Button type="button" onClick={capturePhoto}>
                                Chụp ảnh
                            </Button>
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    )}

                    {/* Preview ảnh đã chọn */}
                    {imageFile && (
                        <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Preview"
                            className="w-32 rounded"
                        />
                    )}

                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            )}
        </div>
    );
}
