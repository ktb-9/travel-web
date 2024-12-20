import { Plus } from "lucide-react";
import { ImageGridProps } from "../../../../../type/ImageGrid/ImageGrid";

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  currentImage,
  onImageSelect,
  onImageAdd,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images.map((img, index) => (
        <div
          key={index}
          className={`group aspect-square rounded-lg border-2 transition-all cursor-pointer overflow-hidden
              ${
                img === currentImage
                  ? "border-blue-500 shadow-md"
                  : "border-transparent hover:border-gray-300"
              }`}
          onClick={() => onImageSelect(img, index)}
        >
          <img
            src={img}
            alt={`편집 이미지 ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <label className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all border-2 border-dashed border-gray-300">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files?.[0]) {
              onImageAdd(files[0]);
            }
          }}
          className="hidden"
        />
        <Plus className="w-6 h-6 text-gray-400" />
      </label>
    </div>
  );
};
