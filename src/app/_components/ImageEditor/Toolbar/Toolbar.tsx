import { Circle, Redo, RotateCcw, Square, Undo } from "lucide-react";
import { ToolBarProps } from "../../../../../type/Toolbar/Toolbar";
import { Button } from "../../Common/Button/Button";
import { IconButton } from "../../Common/IconButton/IconButton";

export const ToolBar: React.FC<ToolBarProps> = ({
  selectedTool,
  brushSize,
  onToolChange,
  onBrushSizeChange,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* 도구 선택 버튼 */}
          <div className="flex items-center gap-2">
            <Button
              variant={selectedTool === "brush" ? "primary" : "secondary"}
              onClick={() => onToolChange("brush")}
              icon={<Circle className="w-5 h-5" />}
            >
              브러시
            </Button>
            <Button
              variant={selectedTool === "rectangle" ? "primary" : "secondary"}
              onClick={() => onToolChange("rectangle")}
              icon={<Square className="w-5 h-5" />}
            >
              사각형
            </Button>
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* 실행 취소/다시 실행/초기화 버튼 */}
          <div className="flex items-center gap-2">
            <IconButton
              icon={<Undo className="w-5 h-5" />}
              onClick={onUndo}
              disabled={!canUndo}
              title="실행 취소"
            />
            <IconButton
              icon={<Redo className="w-5 h-5" />}
              onClick={onRedo}
              disabled={!canRedo}
              title="다시 실행"
            />
            <IconButton
              icon={<RotateCcw className="w-5 h-5" />}
              onClick={onReset}
              title="초기화"
            />
          </div>

          {/* 브러시 크기 조절 */}
          {selectedTool === "brush" && (
            <>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={brushSize}
                  onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                  className="w-32"
                />
                <span className="font-medium text-gray-600 min-w-[2.5rem] text-center">
                  {brushSize}px
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
