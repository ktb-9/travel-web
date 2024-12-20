import { EditMode } from "..";

export interface HeaderProps {
  mode: EditMode;
  onModeChange: (mode: EditMode) => void;
}
