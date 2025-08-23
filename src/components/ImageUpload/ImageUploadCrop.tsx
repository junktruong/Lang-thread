"use client";

import { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";

interface Props {
    onImageCropped: (file: File, previewUrl: string) => void;
}

export default function ImageUploaderWithCrop({ onImageCropped }: Props) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cameraInputRef = useRef<HTMLInputElement | null>(null);

    // chọn hoặc chụp ảnh xong => set ảnh gốc
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // tạo file sau khi crop
    const handleCropComplete = async () => {
        if (!imageSrc) return;

        const croppedBlob = await getCroppedImg(imageSrc);
        if (!croppedBlob) return;

        const file = new File([croppedBlob], "cropped.webp", { type: "image/webp" });
        const url = URL.createObjectURL(croppedBlob);

        setCroppedImage(url);
        onImageCropped(file, url);

        // reset
        setImageSrc(null);
    };

    return (
        <div className="space-y-3">
            {/* Nút chọn và chụp */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                >
                    📂 Chọn ảnh
                </Button>
                <Button
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                >
                    📷 Chụp ảnh
                </Button>
            </div>

            {/* input hidden */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={cameraInputRef}
                onChange={handleFileChange}
            />

            {/* Crop UI */}
            {imageSrc && (
                <div className="relative w-64 h-64 bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // hình vuông
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                    />
                    <Button
                        className="absolute bottom-2 left-2"
                        onClick={handleCropComplete}
                    >
                        ✂️ Cắt
                    </Button>
                </div>
            )}

            {/* Preview sau khi crop */}
            {croppedImage && (
                <img
                    src={croppedImage}
                    alt="Cropped"
                    className="w-48 h-48 object-cover rounded"
                />
            )}
        </div>
    );
}

/**
 * Cắt ảnh thành blob webp
 */
async function getCroppedImg(imageSrc: string): Promise<Blob | null> {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(null);
            ctx.drawImage(
                img,
                (img.width - size) / 2,
                (img.height - size) / 2,
                size,
                size,
                0,
                0,
                size,
                size
            );
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else resolve(null);
                },
                "image/webp",
                0.8
            );
        };
    });
}
