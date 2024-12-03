import { useEffect } from "react";
import { ImageCanvasProps } from "../../../../../type/ImageEditor/ImageEditor";
import useCanvasHandler from "../../../../../hooks/ImageEdtor/useCanvasHandler";
import { ImagePlus } from "lucide-react";
import { Loader2 } from "lucide-react";

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  containerRef,
  canvasRef,
  previewImage,
  isLoading,
  imageRef,
  contextRef,
  onImageUpload,
}) => {
  const { startDrawing, draw, stopDrawing, resizeCanvas, brushWidth } =
    useCanvasHandler(canvasRef, containerRef, imageRef, contextRef);

  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    resizeCanvas();
  }, [brushWidth]);

  useEffect(() => {
    if (!previewImage) return;

    const image = new Image();
    image.src = previewImage;
    imageRef.current = image;
    image.onload = () => {
      resizeCanvas();
    };
  }, [previewImage]);
  return (
    <div ref={containerRef} className="relative w-full h-[400px]">
      {previewImage ? (
        <div className="relative w-full h-full group">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 cursor-crosshair touch-none"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <label className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          <ImagePlus className="w-8 h-8 mb-2 text-gray-400" />
          <span className="text-gray-500">이미지를 업로드해주세요</span>
        </label>
      )}
    </div>
  );
};

export default ImageCanvas;
