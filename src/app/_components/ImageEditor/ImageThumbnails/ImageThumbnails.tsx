import React from "react";
import { ImagePlus } from "lucide-react";
import { ImageThumbnailsProps } from "../../../../../type/ImageEditor/ImageEditor";

export default function ImageThumbnails({
  thumbnails,
  onThumbnailClick,
  onImageUpload,
}: ImageThumbnailsProps): JSX.Element {
  return (
    <div className="flex gap-2 p-4 overflow-x-auto h-auto">
      {thumbnails.map((thumb, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-20 h-20 border rounded-lg overflow-hidden cursor-pointer"
          onClick={() => onThumbnailClick(thumb)}
        >
          <img
            src={thumb}
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <label className="flex-shrink-0 w-20 h-20 flex items-center justify-center border rounded-lg cursor-pointer bg-gray-50">
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
        <ImagePlus className="w-6 h-6 text-gray-400" />
      </label>
    </div>
  );
}
