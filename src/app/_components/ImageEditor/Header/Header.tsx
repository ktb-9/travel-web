import { Eraser, Paintbrush } from "lucide-react";
import { Button } from "../../Common/Button/Button";
import { HeaderProps } from "../../../../../type/Header/Header";

export const Header: React.FC<HeaderProps> = ({ mode, onModeChange }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={mode === "edit" ? "primary" : "secondary"}
          onClick={() => onModeChange("edit")}
          icon={<Paintbrush className="w-5 h-5" />}
        >
          일반 편집
        </Button>
        <Button
          variant={mode === "remove" ? "danger" : "secondary"}
          onClick={() => onModeChange("remove")}
          icon={<Eraser className="w-5 h-5" />}
        >
          지우기
        </Button>
      </div>
    </div>
  );
};
