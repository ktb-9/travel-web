import { useState, ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";

interface FileInputEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

export default function PhotoCollection(): JSX.Element {
  const [previewImage, setPreviewImage] = useState<string | null>(
    "/api/placeholder/400/500"
  );
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const handleImageUpload = (e: FileInputEvent): void => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setThumbnails((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    }
  };

  // 썸네일 클릭 시 메인 이미지로 설정하는 핸들러 추가
  const handleThumbnailClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 이미지 컨테이너  */}
      <div className="relative w-full aspect-[3/4]">
        {previewImage ? (
          <div className="relative w-full h-full group">
            <img
              src={previewImage}
              alt="Main preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <ImagePlus className="w-8 h-8 mb-2 text-gray-400" />
            <span className="text-gray-500">이미지를 업로드해주세요</span>
          </label>
        )}
      </div>

      {/* 섭네일 갤러리*/}
      <div className="flex gap-2 p-4 overflow-x-auto h-auto">
        {thumbnails.map((thumb, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-20 h-20 border rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleThumbnailClick(thumb)}
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
            onChange={handleImageUpload}
            className="hidden"
          />
          <ImagePlus className="w-6 h-6 text-gray-400" />
        </label>
      </div>

      {/* 프롬프트 */}
      <div className="mt-auto p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="수정 사항 입력"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-blue-500">
              <svg
                className="w-6 h-6 rotate-45"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </span>
          </button>
        </div>
        <button className="w-full mt-4 py-3 bg-pink-400 text-white rounded-lg">
          사진 저장
        </button>
      </div>
    </div>
  );
}
