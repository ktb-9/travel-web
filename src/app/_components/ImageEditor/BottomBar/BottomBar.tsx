import { Send, Download } from "lucide-react";
import { BottomBarProps } from "../../../../../type/BottomBar/BottomBar";
import { IconButton } from "../../Common/IconButton/IconButton";
import { Button } from "../../Common/Button/Button";

interface ExtendedBottomBarProps extends BottomBarProps {
  currentImageUrl?: string; // Optional URL of the current image
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
  const handleDownload = async () => {
    if (!currentImageUrl) return;

    try {
      // Fetch the image as a blob
      const response = await fetch(currentImageUrl);
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.download = `edited-image-${Date.now()}.png`; // Dynamic filename with timestamp

      // Programmatically click the link to trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      // You might want to add error handling here
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
              <span>이미지 다운로드</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
