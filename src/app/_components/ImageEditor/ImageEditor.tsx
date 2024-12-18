import React, { useEffect, useRef, useState } from "react";
import { Circle, Eraser, Paintbrush, Plus, Send, Square } from "lucide-react";
import {
  EditMode,
  Position,
  SelectedTool,
} from "../../../../type/ImageEditor/ImageEditor";

const ImageMaskEditor: React.FC = () => {
  // State management with explicit types
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<SelectedTool>("brush");
  const [brushSize, setBrushSize] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<EditMode>("edit");

  // Canvas Refs with explicit typing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Position>({ x: 0, y: 0 });

  // Image loading and initial setup
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const displayCanvas = displayCanvasRef.current;

        if (!canvas || !maskCanvas || !displayCanvas) {
          console.error("Canvas elements are not initialized.");
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;

        const maxWidth = window.innerWidth * 0.8;
        const maxHeight = window.innerHeight * 0.8;
        const calculatedScale = Math.min(
          maxWidth / img.width,
          maxHeight / img.height
        );
        setScale(calculatedScale);

        displayCanvas.width = img.width * calculatedScale;
        displayCanvas.height = img.height * calculatedScale;

        const ctx = canvas.getContext("2d");
        const displayCtx = displayCanvas.getContext("2d");
        const maskCtx = maskCanvas.getContext("2d");

        if (!ctx || !displayCtx || !maskCtx) {
          console.error("Could not get canvas contexts");
          return;
        }

        ctx.drawImage(img, 0, 0);
        displayCtx.drawImage(
          img,
          0,
          0,
          displayCanvas.width,
          displayCanvas.height
        );

        maskCtx.fillStyle = "black";
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

        if (!imageHistory.length) {
          setImageHistory([img.src]);
          setCurrentIndex(0);
        }
      };
      img.src = URL.createObjectURL(image);
    }
  }, [image, imageHistory]);

  // Drawing functions with improved type safety
  const getScaledCoordinates = (
    e: React.MouseEvent | React.TouchEvent
  ): Position => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) throw new Error("Display canvas not initialized");

    const rect = displayCanvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale,
    };
  };

  const drawBrush = (x: number, y: number) => {
    const maskCanvas = maskCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;

    if (!maskCanvas || !displayCanvas) return;

    const maskCtx = maskCanvas.getContext("2d");
    const displayCtx = displayCanvas.getContext("2d");

    if (!maskCtx || !displayCtx) return;

    const actualBrushSize = brushSize / scale;

    maskCtx.fillStyle = "white";
    maskCtx.beginPath();
    maskCtx.arc(x, y, actualBrushSize / 2, 0, Math.PI * 2);
    maskCtx.fill();

    displayCtx.fillStyle = "rgba(255, 0, 0, 0.3)";
    displayCtx.beginPath();
    displayCtx.arc(x * scale, y * scale, brushSize / 2, 0, Math.PI * 2);
    displayCtx.fill();
  };

  const drawRectangle = (startPos: Position, currentPos: Position) => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;

    const displayCtx = displayCanvas.getContext("2d");
    const canvas = canvasRef.current;

    if (!displayCtx || !canvas) return;

    displayCtx.drawImage(
      canvas,
      0,
      0,
      displayCanvas.width,
      displayCanvas.height
    );

    displayCtx.fillStyle = "rgba(255, 0, 0, 0.3)";
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    displayCtx.fillRect(x * scale, y * scale, width * scale, height * scale);
  };

  // Event handlers for drawing with improved type safety
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getScaledCoordinates(e);
    if (selectedTool === "brush") {
      drawBrush(pos.x, pos.y);
    } else {
      setStartPos(pos);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const pos = getScaledCoordinates(e);
    setCurrentPos(pos);

    if (selectedTool === "brush") {
      drawBrush(pos.x, pos.y);
    } else {
      drawRectangle(startPos, pos);
    }
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isDrawing && selectedTool === "rectangle") {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) return;

      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) return;

      maskCtx.fillStyle = "white";
      const width = Math.abs(currentPos.x - startPos.x);
      const height = Math.abs(currentPos.y - startPos.y);
      maskCtx.fillRect(
        Math.min(startPos.x, currentPos.x),
        Math.min(startPos.y, currentPos.y),
        width,
        height
      );
    }
    setIsDrawing(false);
  };

  const handleEditImage = async (action: "edit" | "remove") => {
    if (!image) {
      setError("Please select an image");
      return;
    }

    if (action === "edit" && (!prompt || prompt.trim().length === 0)) {
      setError("Prompt cannot be empty for editing");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const maskBlob = await new Promise<Blob | null>((resolve) =>
        maskCanvasRef.current?.toBlob((blob) => resolve(blob), "image/png")
      );

      if (!maskBlob || maskBlob.size === 0) {
        throw new Error("Mask blob is empty or not created properly.");
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
        throw new Error(`Failed to edit image: ${errorData}`);
      }

      const result = await response.blob();
      const imageUrl = URL.createObjectURL(result);
      setImageHistory((prev) => [...prev.slice(0, currentIndex + 1), imageUrl]);
      setCurrentIndex((prev) => prev + 1);
      setImage(result as File);
    } catch (error) {
      console.error("Error in handleEditImage:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="px-4 py-3 bg-white border-b">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setEditMode("edit")}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2
                ${
                  editMode === "edit" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
          >
            <Paintbrush className="w-5 h-5" />
            <span>일반 편집</span>
          </button>
          <button
            onClick={() => setEditMode("remove")}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2
                ${
                  editMode === "remove"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100"
                }`}
          >
            <Eraser className="w-5 h-5" />
            <span>지우기</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Tool Selection */}
        <div className="px-4 py-3 bg-white border-b">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTool("brush")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2
                        ${selectedTool === "brush" ? "bg-gray-100" : ""}`}
              >
                <Circle className="w-5 h-5" />
                <span>브러시</span>
              </button>
              <button
                onClick={() => setSelectedTool("rectangle")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2
                        ${selectedTool === "rectangle" ? "bg-gray-100" : ""}`}
              >
                <Square className="w-5 h-5" />
                <span>사각형</span>
              </button>
            </div>
            {selectedTool === "brush" && (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">{brushSize}</span>
              </div>
            )}
          </div>
        </div>
        {/* Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Canvas Container */}
        <div className="relative bg-gray-100 flex items-center justify-center min-h-[30vh]">
          <canvas
            ref={displayCanvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair touch-none"
          />
          <canvas ref={canvasRef} className="hidden" />
          <canvas ref={maskCanvasRef} className="hidden" />
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {selectedImages.map((img, index) => (
            <div key={index} className="aspect-square">
              <img
                src={img}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
          <label className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;
                if (files?.[0]) {
                  setImage(files[0]);
                  setPrompt("");
                  setImageHistory([]);
                  setCurrentIndex(0);
                  setError(null);
                  setSelectedImages((prev) => [
                    ...prev,
                    URL.createObjectURL(files[0]),
                  ]);
                }
              }}
              className="hidden"
            />
            <Plus className="w-6 h-6 text-gray-400" />
          </label>
        </div>

        {/* Prompt Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
          {editMode === "edit" && (
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="수정할 내용을 입력하세요"
                  className="w-full px-4 py-3 pr-12 rounded-lg border"
                />
                <button
                  onClick={() => {
                    if (prompt.trim()) {
                      handleEditImage("edit");
                    }
                  }}
                  disabled={!prompt.trim() || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5 text-blue-500" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => handleEditImage("remove")}
            disabled={isLoading || (editMode === "edit" && !prompt.trim())}
            className={`w-full py-3.5 rounded-lg font-medium text-white
              ${editMode === "remove" ? "bg-red-500" : "bg-blue-500"}
              disabled:bg-gray-300`}
          >
            {editMode === "remove" ? "선택 영역 제거하기" : "편집 완료"}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">Processing...</div>
        </div>
      )}
    </div>
  );
};

export default ImageMaskEditor;
