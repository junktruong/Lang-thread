"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import CameraCapture from "./CameraCapture";
import ImageCropper from "./ImageCropper";

export default function ImageUploader({ onImageCropped }: { onImageCropped: (file: File) => void }) {
    const [rawImage, setRawImage] = useState<File | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setRawImage(e.target.files[0]);
        }
    }

    return (
        <div>
            {/* Icon chọn ảnh */}
            <div className="flex space-x-2">
                <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <Camera className="w-6 h-6" />
                </label>

                <Button type="button" size="sm" onClick={() => setIsCameraOpen(true)}>
                    Chụp
                </Button>
            </div>

            {/* Camera modal */}
            {isCameraOpen && (
                <CameraCapture
                    onCapture={(file) => {
                        setRawImage(file);
                        setIsCameraOpen(false);
                    }}
                    onClose={() => setIsCameraOpen(false)}
                />
            )}

            {/* Cropper */}
            {rawImage && (
                <ImageCropper
                    file={rawImage}
                    onCropped={(croppedFile) => {
                        onImageCropped(croppedFile);
                        setRawImage(null);
                    }}
                    onCancel={() => setRawImage(null)}
                />
            )}

            {/* Preview ảnh đã chọn */}
            {rawImage && (
                <img
                    src={URL.createObjectURL(rawImage)}
                    alt="Preview"
                    className="w-32 rounded"
                />
            )}

        </div>
    );
}
