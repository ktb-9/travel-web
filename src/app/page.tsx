"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "./(pages)/Image";

export default function ImagePage() {
  //리액트 쿼리 적용
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Image />
    </QueryClientProvider>
  );
}
