import { useState } from "react";

export const useImageHistory = () => {
  // 이미지 히스토리 상태 관리
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 새 이미지 추가
  const addImage = (imageUrl: string) => {
    setSelectedImages((prev) => [...prev, imageUrl]);
    setImageHistory((prev) => [...prev.slice(0, currentIndex + 1), imageUrl]);
    setCurrentIndex((prev) => prev + 1);
  };

  // 이미지 선택
  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  return {
    selectedImages,
    imageHistory,
    currentIndex,
    addImage,
    selectImage,
  };
};
