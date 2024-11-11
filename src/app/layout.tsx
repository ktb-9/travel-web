import type { Metadata } from "next";

import "./globals.css";
import { ReactNode } from "react";
type Props = { children: ReactNode };
export const metadata: Metadata = {
  title: "리플 트립",
  description: "테스구조 간편한 여행 일정 관리 어플",
};

//루트 레이아웃
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}
