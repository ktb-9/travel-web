import { ButtonProps } from "../../../../../type/Button/Button";

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  isLoading,
  className,
  ...props
}) => {
  // 기본 스타일 클래스
  const baseStyles =
    "rounded-lg flex items-center justify-center gap-2.5 transition-all font-medium";

  // 버튼 종류별 스타일
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-100 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  // 버튼 크기별 스타일
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3",
    lg: "px-5 py-4",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};
