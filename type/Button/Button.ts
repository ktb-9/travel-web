export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"; // 버튼 스타일 종류
  size?: "sm" | "md" | "lg"; // 버튼 크기
  icon?: React.ReactNode; // 버튼 아이콘
  isLoading?: boolean; // 로딩 상태
}
