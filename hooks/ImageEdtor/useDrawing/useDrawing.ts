import { useState } from "react";
import { Position } from "../../../type";

export const useDrawing = (scale: number) => {
  // 그리기 상태 관리
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Position>({ x: 0, y: 0 });

  // 마우스/터치 좌표를 캔버스 좌표로 변환
  const getScaledCoordinates = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ): Position => {
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale,
    };
  };

  return {
    isDrawing,
    setIsDrawing,
    startPos,
    setStartPos,
    currentPos,
    setCurrentPos,
    getScaledCoordinates,
  };
};
