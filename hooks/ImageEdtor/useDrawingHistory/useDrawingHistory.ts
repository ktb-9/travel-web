import { useState } from "react";
import { DrawingState } from "../../../type";

export const useDrawingHistory = () => {
  // 그리기 히스토리 상태 관리
  const [drawingHistory, setDrawingHistory] = useState<DrawingState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // 새로운 상태 추가
  const addToHistory = (state: DrawingState) => {
    setDrawingHistory((prev) => [...prev.slice(0, historyIndex + 1), state]);
    setHistoryIndex((prev) => prev + 1);
  };

  // 실행 취소
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  };

  // 다시 실행
  const redo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
    }
  };

  // 초기화
  const reset = () => {
    setHistoryIndex(0);
  };

  return {
    drawingHistory,
    historyIndex,
    addToHistory,
    undo,
    redo,
    reset,
  };
};
