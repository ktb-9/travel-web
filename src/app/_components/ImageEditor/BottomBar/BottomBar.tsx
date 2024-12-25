import { Send, Download } from "lucide-react";
import { BottomBarProps } from "../../../../../type/BottomBar/BottomBar";
import { IconButton } from "../../Common/IconButton/IconButton";
import { Button } from "../../Common/Button/Button";
import axios from "axios";
import { useEffect, useState } from "react";

interface ExtendedBottomBarProps extends BottomBarProps {
  currentImageUrl: File | null;
}

export const BottomBar: React.FC<ExtendedBottomBarProps> = ({
  mode,
  prompt,
  isLoading,
  onPromptChange,
  onEdit,
  onRemove,
  currentImageUrl,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [imageFrame, setImageFrame] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent));

    // Create overlay container
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.9);
      display: none;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      z-index: 9999;
      padding: 20px;
    `;

    document.body.appendChild(overlay);
    setImageFrame(overlay);

    return () => {
      document.body.removeChild(overlay);
    };
  }, []);

  const showImage = (imageUrl: string) => {
    if (!imageFrame) return;

    // Clear previous content
    imageFrame.innerHTML = "";

    // Create image element
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.cssText =
      "max-width: 100%; max-height: 80vh; object-fit: contain;";

    // Create instruction text
    const instructions = document.createElement("p");
    instructions.textContent = "이미지를 길게 누르면 저장할 수 있습니다";
    instructions.style.cssText =
      "color: white; margin-top: 20px; font-family: -apple-system, sans-serif;";

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "닫기";
    closeButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      padding: 10px;
      cursor: pointer;
      font-family: -apple-system, sans-serif;
    `;

    closeButton.onclick = () => {
      imageFrame.style.display = "none";
    };

    // Add elements to overlay
    imageFrame.appendChild(closeButton);
    imageFrame.appendChild(img);
    imageFrame.appendChild(instructions);

    // Show overlay
    imageFrame.style.display = "flex";
  };

  const handleDownload = async () => {
    if (!currentImageUrl) return;

    try {
      const formData = new FormData();
      formData.append("thumbnail", currentImageUrl);

      const randomUserId = Math.floor(Math.random() * 1000) + 1;

      const response = await axios.post(
        `https://server.zero-dang.com/image/${randomUserId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { thumbnailUrl } = response.data;

      if (!thumbnailUrl) {
        throw new Error("썸네일 URL을 받아오지 못했습니다.");
      }

      if (isMobile) {
        showImage(thumbnailUrl);
      } else {
        // Desktop download
        const link = document.createElement("a");
        link.href = thumbnailUrl;
        link.download = `image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("이미지 업로드/다운로드 중 오류 발생:", error);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
        {mode === "edit" && (
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="수정할 내용을 입력하세요"
                className="w-full px-4 py-3.5 pr-12 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <IconButton
                icon={<Send className="text-blue-500" />}
                onClick={onEdit}
                disabled={!prompt.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        )}

        <Button
          variant={mode === "remove" ? "danger" : "primary"}
          size="lg"
          onClick={mode === "remove" ? onRemove : handleDownload}
          disabled={isLoading || (mode === "edit" && !currentImageUrl)}
          className="w-full"
        >
          {mode === "remove" ? (
            "선택 영역 제거하기"
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Download size={20} />
              <span>이미지 {isMobile ? "저장" : "다운로드"}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
