import { useState, ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";

interface FileInputEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

export default function Content(): JSX.Element {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = (e: FileInputEvent): void => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="flex flex-col ">
      <div className="relative w-full h-[350px]">
        {previewImage ? (
          <div className="relative w-full h-full group">
            <img
              src={previewImage}
              alt="Uploaded preview"
              className="w-full h-full "
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-white flex items-center gap-2">
                <ImagePlus size={24} />
                이미지 변경
              </span>
            </label>
          </div>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
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
    </section>
  );
}
