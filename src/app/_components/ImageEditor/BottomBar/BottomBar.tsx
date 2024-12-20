import { Send } from "lucide-react";
import { BottomBarProps } from "../../../../../type/BottomBar/BottomBar";
import { IconButton } from "../../Common/IconButton/IconButton";
import { Button } from "../../Common/Button/Button";

export const BottomBar: React.FC<BottomBarProps> = ({
  mode,
  prompt,
  isLoading,
  onPromptChange,
  onEdit,
  onRemove,
}) => {
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
          onClick={mode === "remove" ? onRemove : onEdit}
          disabled={isLoading || (mode === "edit" && !prompt.trim())}
          className="w-full"
        >
          {mode === "remove" ? "선택 영역 제거하기" : "편집 완료"}
        </Button>
      </div>
    </div>
  );
};
