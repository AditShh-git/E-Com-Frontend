"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";

export default function ImageCropper({ image, onCancel, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const onCropCompleteHandler = useCallback((_, croppedAreaPixels) => {
    setCroppedPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = async () => {
    if (!image || !croppedPixels) return;

    const canvas = document.createElement("canvas");
    const img = document.createElement("img");

    img.src = image;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    canvas.width = croppedPixels.width;
    canvas.height = croppedPixels.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      croppedPixels.x,
      croppedPixels.y,
      croppedPixels.width,
      croppedPixels.height,
      0,
      0,
      croppedPixels.width,
      croppedPixels.height
    );

    canvas.toBlob((blob) => {
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
      onCropComplete(file);
    }, "image/jpeg");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl w-[90%] max-w-lg shadow-xl space-y-4">
        <h2 className="text-lg font-semibold text-center">Crop Your Image</h2>

        <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        {/* Zoom Slider */}
        <div className="flex flex-col items-center">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-1/2"
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={getCroppedImage}>Save</Button>
        </div>
      </div>
    </div>
  );
}
