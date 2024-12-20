import { useRef } from "react";

export const useCanvas = () => {
  // 캔버스 참조들
  const canvasRef = useRef<HTMLCanvasElement>(null); // 원본 이미지 캔버스
  const maskCanvasRef = useRef<HTMLCanvasElement>(null); // 마스크 캔버스
  const displayCanvasRef = useRef<HTMLCanvasElement>(null); // 디스플레이 캔버스

  // 캔버스 초기화 함수
  const initializeCanvas = (image: HTMLImageElement, scale: number) => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;

    if (!canvas || !maskCanvas || !displayCanvas) return null;

    const ctx = canvas.getContext("2d");
    const maskCtx = maskCanvas.getContext("2d");
    const displayCtx = displayCanvas.getContext("2d");

    if (!ctx || !maskCtx || !displayCtx) return null;

    // 캔버스 크기 설정
    canvas.width = image.width;
    canvas.height = image.height;
    maskCanvas.width = image.width;
    maskCanvas.height = image.height;
    displayCanvas.width = image.width * scale;
    displayCanvas.height = image.height * scale;

    // 이미지 그리기
    ctx.drawImage(image, 0, 0);
    displayCtx.drawImage(
      image,
      0,
      0,
      displayCanvas.width,
      displayCanvas.height
    );

    // 마스크 초기화
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    return {
      ctx,
      maskCtx,
      displayCtx,
      dimensions: {
        width: image.width,
        height: image.height,
      },
    };
  };

  return {
    canvasRef,
    maskCanvasRef,
    displayCanvasRef,
    initializeCanvas,
  };
};
