import { EditMode } from "..";

export interface BottomBarProps {
  mode: EditMode;
  prompt: string;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onEdit: () => void;
  onRemove: () => void;
}
