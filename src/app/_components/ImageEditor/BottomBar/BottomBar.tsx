import { Send, Download, Link } from "lucide-react";
import { BottomBarProps } from "../../../../../type/BottomBar/BottomBar";
import { IconButton } from "../../Common/IconButton/IconButton";
import { Button } from "../../Common/Button/Button";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

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
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent));
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "0";
    textArea.style.top = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);

    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }

    try {
      document.execCommand("copy");
      setCopyStatus("URL이 복사되었습니다!");
    } catch (error) {
      setCopyStatus("복사 실패. URL: " + error);
    }

    document.body.removeChild(textArea);
    setTimeout(() => setCopyStatus(""), 2000);
  }, []);

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
        setImageUrl(thumbnailUrl);
        copyToClipboard(thumbnailUrl);
      } else {
        const link = document.createElement("a");
        link.href = thumbnailUrl;
        link.download = `image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("이미지 업로드/다운로드 중 오류 발생:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      setCopyStatus(`오류: ${errorMessage}`);
      setTimeout(() => setCopyStatus(""), 3000);
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

        <div className="flex flex-col gap-2">
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
                {isMobile ? <Link size={20} /> : <Download size={20} />}
                <span>이미지 {isMobile ? "URL 복사" : "다운로드"}</span>
              </div>
            )}
          </Button>
          {copyStatus && (
            <div className="text-center text-sm text-gray-600">
              {copyStatus}
            </div>
          )}
          {imageUrl && isMobile && (
            <div
              className="text-center text-sm text-blue-600 break-all p-2"
              onClick={() => copyToClipboard(imageUrl)}
            >
              {imageUrl}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
