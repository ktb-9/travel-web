import { IconButtonProps } from "../../../../../type/IconButton/IconButton";

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = "secondary",
  className,
  ...props
}) => {
  // 기본 스타일 클래스
  const baseStyles = "p-2.5 rounded-lg transition-all";

  // 버튼 종류별 스타일
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "hover:bg-gray-100 active:bg-gray-200",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${
        props.disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      <span className="w-5 h-5">{icon}</span>
    </button>
  );
};
