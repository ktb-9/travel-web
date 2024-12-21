import React, { useEffect, useCallback } from "react";

import { EditMode, Position, SelectedTool } from "../../../../type";
import { useCanvas } from "../../../../hooks/ImageEdtor/useCanvas/useCavas";
import { useDrawing } from "../../../../hooks/ImageEdtor/useDrawing/useDrawing";
import { useImageHistory } from "../../../../hooks/ImageEdtor/useImageHistory/useImageHistory";
import { useDrawingHistory } from "../../../../hooks/ImageEdtor/useDrawingHistory/useDrawingHistory";
import { Header } from "./Header/Header";
import { ToolBar } from "./Toolbar/Toolbar";
import { ErrorMessage } from "../Common/ErrorMessage/ErrorMessage";
import { Canvas } from "./Canvas/Canvas";
import { ImageGrid } from "./ImageGrid/ImageGrid";
import { BottomBar } from "./BottomBar/BottomBar";
import { LoadingOverlay } from "../Common/LoadingOverlay/LoadingOverlay";

export const ImageEditor: React.FC = () => {
  // 상태 관리
  const [image, setImage] = React.useState<File | null>(null);
  const [prompt, setPrompt] = React.useState<string>("");
  const [selectedTool, setSelectedTool] = React.useState<SelectedTool>("brush");
  const [brushSize, setBrushSize] = React.useState<number>(20);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [scale, setScale] = React.useState<number>(1);
  const [editMode, setEditMode] = React.useState<EditMode>("edit");

  // 커스텀 훅 사용
  const canvas = useCanvas();
  const drawing = useDrawing(scale);
  const imageHistory = useImageHistory();
  const drawingHistory = useDrawingHistory();

  // 이미지 로드 시 초기화
  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      // 캔버스 초기화 및 크기 계산
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.6;
      const calculatedScale = Math.min(
        maxWidth / img.width,
        maxHeight / img.height
      );
      setScale(calculatedScale);

      const result = canvas.initializeCanvas(img, calculatedScale);
      if (!result) return;

      const { maskCtx, displayCtx } = result;

      // 초기 상태 저장
      drawingHistory.addToHistory({
        maskData: maskCtx.getImageData(
          0,
          0,
          maskCtx.canvas.width,
          maskCtx.canvas.height
        ),
        previewData: displayCtx.getImageData(
          0,
          0,
          displayCtx.canvas.width,
          displayCtx.canvas.height
        ),
      });
    };
    img.src = URL.createObjectURL(image);
  }, [image]);

  // 그리기 이벤트 핸들러
  const handleStartDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const displayCanvas = canvas.displayCanvasRef.current;
      if (!displayCanvas) return;

      drawing.setIsDrawing(true);
      const pos = drawing.getScaledCoordinates(e, displayCanvas);

      if (selectedTool === "brush") {
        drawBrush(pos.x, pos.y);
      } else {
        drawing.setStartPos(pos);
        drawing.setCurrentPos(pos);
      }
    },
    [selectedTool, canvas.displayCanvasRef]
  );

  const handleDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!drawing.isDrawing) return;

      const displayCanvas = canvas.displayCanvasRef.current;
      if (!displayCanvas) return;

      const pos = drawing.getScaledCoordinates(e, displayCanvas);
      drawing.setCurrentPos(pos);

      if (selectedTool === "brush") {
        drawBrush(pos.x, pos.y);
      } else {
        drawRectangle(drawing.startPos, pos);
      }
    },
    [drawing.isDrawing, selectedTool, canvas.displayCanvasRef]
  );

  const handleStopDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!drawing.isDrawing) return;

      const maskCanvas = canvas.maskCanvasRef.current;
      const displayCanvas = canvas.displayCanvasRef.current;
      const mainCanvas = canvas.canvasRef.current;
      if (!maskCanvas || !displayCanvas || !mainCanvas) return;

      const maskCtx = maskCanvas.getContext("2d");
      const displayCtx = displayCanvas.getContext("2d");
      const mainCtx = mainCanvas.getContext("2d");
      if (!maskCtx || !displayCtx || !mainCtx) return;

      if (selectedTool === "rectangle") {
        // 마스크 캔버스에 실제로 흰색 사각형 그리기
        maskCtx.fillStyle = "white";
        const x = Math.min(drawing.startPos.x, drawing.currentPos.x);
        const y = Math.min(drawing.startPos.y, drawing.currentPos.y);
        const width = Math.abs(drawing.currentPos.x - drawing.startPos.x);
        const height = Math.abs(drawing.currentPos.y - drawing.startPos.y);
        maskCtx.fillRect(x, y, width, height);

        // 프리뷰 초기화 및 메인 이미지 다시 그리기
        displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
        displayCtx.drawImage(
          mainCanvas,
          0,
          0,
          displayCanvas.width,
          displayCanvas.height
        );

        // 레드 오버레이 다시 그리기
        displayCtx.fillStyle = "rgba(255, 0, 0, 0.3)";
        displayCtx.fillRect(
          x * scale,
          y * scale,
          width * scale,
          height * scale
        );
      }

      saveDrawingState();
      drawing.setIsDrawing(false);
    },
    [drawing.isDrawing, selectedTool, canvas, scale]
  );

  // 그리기 함수들
  const drawBrush = (x: number, y: number) => {
    const maskCanvas = canvas.maskCanvasRef.current;
    const displayCanvas = canvas.displayCanvasRef.current;
    if (!maskCanvas || !displayCanvas) return;

    const maskCtx = maskCanvas.getContext("2d");
    const displayCtx = displayCanvas.getContext("2d");
    if (!maskCtx || !displayCtx) return;

    const actualBrushSize = brushSize / scale;

    // 마스크에 그리기
    maskCtx.fillStyle = "white";
    maskCtx.beginPath();
    maskCtx.arc(x, y, actualBrushSize / 2, 0, Math.PI * 2);
    maskCtx.fill();

    // 프리뷰에 그리기
    displayCtx.fillStyle = "rgba(255, 0, 0, 0.3)";
    displayCtx.beginPath();
    displayCtx.arc(x * scale, y * scale, brushSize / 2, 0, Math.PI * 2);
    displayCtx.fill();
  };

  const drawRectangle = (startPos: Position, currentPos: Position) => {
    const displayCanvas = canvas.displayCanvasRef.current;
    const mainCanvas = canvas.canvasRef.current;
    if (!displayCanvas || !mainCanvas) return;

    const displayCtx = displayCanvas.getContext("2d");
    if (!displayCtx) return;

    // 원본 이미지 다시 그리기
    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    // 메인 캔버스에서 현재 이미지 복사
    displayCtx.drawImage(
      mainCanvas,
      0,
      0,
      displayCanvas.width,
      displayCanvas.height
    );

    // 사각형 프리뷰 그리기
    displayCtx.fillStyle = "rgba(255, 0, 0, 0.3)";
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);
    displayCtx.fillRect(x * scale, y * scale, width * scale, height * scale);
  };

  const saveDrawingState = () => {
    const maskCanvas = canvas.maskCanvasRef.current;
    const displayCanvas = canvas.displayCanvasRef.current;
    if (!maskCanvas || !displayCanvas) return;

    const maskCtx = maskCanvas.getContext("2d");
    const displayCtx = displayCanvas.getContext("2d");
    if (!maskCtx || !displayCtx) return;

    drawingHistory.addToHistory({
      maskData: maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height),
      previewData: displayCtx.getImageData(
        0,
        0,
        displayCanvas.width,
        displayCanvas.height
      ),
    });
  };

  // 실행 취소/다시 실행 처리
  const handleUndo = () => {
    const maskCanvas = canvas.maskCanvasRef.current;
    const displayCanvas = canvas.displayCanvasRef.current;
    if (!maskCanvas || !displayCanvas) return;

    const maskCtx = maskCanvas.getContext("2d");
    const displayCtx = displayCanvas.getContext("2d");
    if (!maskCtx || !displayCtx || drawingHistory.historyIndex <= 0) return;

    const previousState =
      drawingHistory.drawingHistory[drawingHistory.historyIndex - 1];
    maskCtx.putImageData(previousState.maskData, 0, 0);
    displayCtx.putImageData(previousState.previewData, 0, 0);
    drawingHistory.undo();
  };

  const handleRedo = () => {
    const maskCanvas = canvas.maskCanvasRef.current;
    const displayCanvas = canvas.displayCanvasRef.current;
    if (!maskCanvas || !displayCanvas) return;

    const maskCtx = maskCanvas.getContext("2d");
    const displayCtx = displayCanvas.getContext("2d");
    if (
      !maskCtx ||
      !displayCtx ||
      drawingHistory.historyIndex >= drawingHistory.drawingHistory.length - 1
    )
      return;

    const nextState =
      drawingHistory.drawingHistory[drawingHistory.historyIndex + 1];
    maskCtx.putImageData(nextState.maskData, 0, 0);
    displayCtx.putImageData(nextState.previewData, 0, 0);
    drawingHistory.redo();
  };

  // 이미지 편집 요청 처리
  const handleEditImage = async (action: EditMode) => {
    if (!image) {
      setError("이미지를 선택해주세요");
      return;
    }

    if (action === "edit" && !prompt.trim()) {
      setError("수정할 내용을 입력해주세요");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const maskBlob = await new Promise<Blob | null>((resolve) =>
        canvas.maskCanvasRef.current?.toBlob(
          (blob) => resolve(blob),
          "image/png"
        )
      );

      if (!maskBlob || maskBlob.size === 0) {
        throw new Error("마스크 영역이 없습니다");
      }

      const formData = new FormData();
      formData.append("image", image);
      formData.append("type", action);
      formData.append("mask", maskBlob);

      if (action === "edit") {
        formData.append("prompt", prompt.trim());
      }

      const response = await fetch("https://ai.zero-dang.com/api/edit-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const result = await response.blob();
      const imageUrl = URL.createObjectURL(result);

      imageHistory.addImage(imageUrl);
      setImage(new File([result], "edited-image.png", { type: "image/png" }));

      // 마스크 초기화
      const maskCanvas = canvas.maskCanvasRef.current;
      const displayCanvas = canvas.displayCanvasRef.current;
      if (maskCanvas && displayCanvas) {
        const maskCtx = maskCanvas.getContext("2d");
        const displayCtx = displayCanvas.getContext("2d");
        if (maskCtx && displayCtx) {
          maskCtx.fillStyle = "black";
          maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

          const initialState = {
            maskData: maskCtx.getImageData(
              0,
              0,
              maskCanvas.width,
              maskCanvas.height
            ),
            previewData: displayCtx.getImageData(
              0,
              0,
              displayCanvas.width,
              displayCanvas.height
            ),
          };

          drawingHistory.addToHistory(initialState);
        }
      }
    } catch (error) {
      console.error("Edit image error:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 선택 처리
  const handleImageSelect = async (selectedImage: string) => {
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      setImage(new File([blob], "image.png", { type: "image/png" }));

      const historyIndex = imageHistory.imageHistory.indexOf(selectedImage);
      if (historyIndex !== -1) {
        imageHistory.selectImage(historyIndex);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      setError("이미지 선택 중 오류가 발생했습니다");
    }
  };
  const resetCanvases = () => {
    const maskCanvas = canvas.maskCanvasRef.current;
    const displayCanvas = canvas.displayCanvasRef.current;
    const mainCanvas = canvas.canvasRef.current;

    if (!maskCanvas || !displayCanvas || !mainCanvas) return;

    const maskCtx = maskCanvas.getContext("2d");
    const displayCtx = displayCanvas.getContext("2d");

    if (!maskCtx || !displayCtx) return;

    // 마스크를 다 블랙으로
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // 이미지를 원상 복귀
    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    displayCtx.drawImage(
      mainCanvas,
      0,
      0,
      displayCanvas.width,
      displayCanvas.height
    );

    // 히스토리 리셋
    drawingHistory.reset();

    // 히스토리 새로운 상태
    const newInitialState = {
      maskData: maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height),
      previewData: displayCtx.getImageData(
        0,
        0,
        displayCanvas.width,
        displayCanvas.height
      ),
    };

    drawingHistory.addToHistory(newInitialState);
  };

  // 새 이미지 추가 처리
  const handleImageAdd = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setImage(file);
    setPrompt("");
    imageHistory.addImage(imageUrl);
    setError(null);
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-50">
      <Header mode={editMode} onModeChange={setEditMode} />

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6">
          <ToolBar
            selectedTool={selectedTool}
            brushSize={brushSize}
            onToolChange={setSelectedTool}
            onBrushSizeChange={setBrushSize}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onReset={resetCanvases}
            canUndo={drawingHistory.historyIndex > 0}
            canRedo={
              drawingHistory.historyIndex <
              drawingHistory.drawingHistory.length - 1
            }
          />

          {error && <ErrorMessage message={error} />}

          <Canvas
            displayCanvasRef={canvas.displayCanvasRef}
            canvasRef={canvas.canvasRef}
            maskCanvasRef={canvas.maskCanvasRef}
            onStartDrawing={handleStartDrawing}
            onDrawing={handleDrawing}
            onStopDrawing={handleStopDrawing}
          />

          <ImageGrid
            images={imageHistory.selectedImages}
            currentImage={imageHistory.imageHistory[imageHistory.currentIndex]}
            onImageSelect={handleImageSelect}
            onImageAdd={handleImageAdd}
          />
        </div>
      </div>

      <BottomBar
        mode={editMode}
        prompt={prompt}
        isLoading={isLoading}
        onPromptChange={setPrompt}
        onEdit={() => handleEditImage("edit")}
        onRemove={() => handleEditImage("remove")}
      />

      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default ImageEditor;
