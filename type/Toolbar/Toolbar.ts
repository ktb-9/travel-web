import { SelectedTool } from "..";

export interface ToolBarProps {
  selectedTool: SelectedTool;
  brushSize: number;
  onToolChange: (tool: SelectedTool) => void;
  onBrushSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
