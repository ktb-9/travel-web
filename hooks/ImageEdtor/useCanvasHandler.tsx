import { useCallback, useState } from "react";

const useCanvasHandler = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  imageRef: React.MutableRefObject<HTMLImageElement | null>,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushWidth, setBrushWidth] = useState(40);

  const resizeCanvas = useCallback(() => {
    //그림판 영역
    const canvas = canvasRef.current;
    // 이미지 영역
    const container = containerRef.current;
    const img = imageRef.current;
    if (!canvas || !container || !img) return;
    // 이미지 영역 콜리전
    const rect = container.getBoundingClientRect();

    // 켄버스 화면 크기
    canvas.style.width = "100%";
    canvas.style.height = "400px";

    // 캔번스 내부 픽셀 크기
    canvas.width = rect.width;
    canvas.height = rect.height;

    // 2D 그래픽을 그릴 수 있는 컨텍스트 객체
    const context = canvas.getContext("2d");
    if (!context) return;
    context.lineCap = "round";
    context.lineWidth = brushWidth;
    context.globalAlpha = 1;
    context.strokeStyle = "rgba(128, 128, 128, 0.1)";
    contextRef.current = context;

    // 이미지의 가로세로 비율과 컨테이너의 가로세로 비율
    if (imageRef.current) {
      const img = imageRef.current;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const containerRatio = rect.width / rect.height;

      const drawWidth: number =
        imgRatio > containerRatio ? rect.width : rect.height * imgRatio;

      const drawHeight: number =
        imgRatio > containerRatio ? rect.width / imgRatio : rect.height;

      const x = (rect.width - drawWidth) / 2;
      const y = (rect.height - drawHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, drawWidth, drawHeight);
    }
  }, [brushWidth, canvasRef, containerRef, imageRef, contextRef]);

  // 클릭 좌표
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // 모바일 이면
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  //   브러쉬 이동
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (!contextRef.current) return;
    const { x, y } = getCoordinates(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  //   브러쉬 그리기
  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (!isDrawing || !contextRef.current) return;
    const { x, y } = getCoordinates(e);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  return {
    startDrawing,
    draw,
    stopDrawing,
    resizeCanvas,
    brushWidth,
    setBrushWidth,
  };
};
export default useCanvasHandler;
