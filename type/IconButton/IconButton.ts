export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode; // 버튼에 표시할 아이콘
  variant?: "primary" | "secondary"; // 버튼 스타일 종류
}
