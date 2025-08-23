"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function CameraCapture({
    onCapture,
    onClose,
}: {
    onCapture: (file: File) => void;
    onClose: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        async function initCamera() {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }
        initCamera();
        return () => {
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    function handleCapture() {
        if (!videoRef.current || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx?.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `capture-${Date.now()}.png`, { type: "image/png" });
                onCapture(file);
            }
        }, "image/png");
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center space-y-2">
            <video ref={videoRef} autoPlay className="w-80 rounded" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex space-x-2">
                <Button onClick={handleCapture}>Chụp</Button>
                <Button variant="outline" onClick={onClose}>Đóng</Button>
            </div>
        </div>
    );
}
