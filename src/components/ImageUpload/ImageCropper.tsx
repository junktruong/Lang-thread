"use client";

import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

export default function ImageCropper({
    file,
    onCropped,
    onCancel,
}: {
    file: File;
    onCropped: (file: File) => void;
    onCancel: () => void;
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    async function getCroppedImage() {
        const image = await createImage(URL.createObjectURL(file));
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const { width, height, x, y } = croppedAreaPixels;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    const croppedFile = new File([blob], `crop-${Date.now()}.webp`, { type: "image/webp" });
                    resolve(croppedFile);
                }
            }, "image/webp");
        });
    }

    async function handleCrop() {
        const cropped = await getCroppedImage();
        onCropped(cropped);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <div className="relative w-80 h-80 bg-gray-900">
                <Cropper
                    image={URL.createObjectURL(file)}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div className="flex space-x-2 mt-4">
                <Button onClick={handleCrop}>Cắt ảnh</Button>
                <Button variant="outline" onClick={onCancel}>Hủy</Button>
            </div>
        </div>
    );
}

// helper load ảnh
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
}
