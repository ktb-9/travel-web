import { useState, ChangeEvent, useRef, useEffect } from "react";
import { ImagePlus } from "lucide-react";

interface FileInputEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

export default function ImageView(): JSX.Element {
  const [previewImage, setPreviewImage] = useState<string | null>(
    "/api/placeholder/400/500"
  );
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushWidth, setBrushWidth] = useState(40);

  // Canvas 크기를 컨테이너에 맞추는 함수
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.style.width = "100%";
    canvas.style.height = "400px";

    // 캔버스의 실제 크기를 컨테이너와 동일하게 설정
    canvas.width = rect.width;
    canvas.height = rect.height;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    context.lineWidth = brushWidth;
    context.globalAlpha = 1;
    context.strokeStyle = "rgba(128, 128, 128, 0.1)";

    contextRef.current = context;

    // 이미지가 있다면 다시 그리기
    if (imageRef.current) {
      const img = imageRef.current;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const containerRatio = rect.width / rect.height;

      let drawWidth, drawHeight;
      if (imgRatio > containerRatio) {
        // 이미지가 더 넓은 경우
        drawWidth = rect.width;
        drawHeight = rect.width / imgRatio;
      } else {
        // 이미지가 더 높은 경우
        drawHeight = rect.height;
        drawWidth = rect.height * imgRatio;
      }

      // 이미지를 중앙에 배치
      const x = (rect.width - drawWidth) / 2;
      const y = (rect.height - drawHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, drawWidth, drawHeight);
    }
  };

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

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

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

  const handleImageUpload = (e: FileInputEvent): void => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setThumbnails((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
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
          </div>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <ImagePlus className="w-8 h-8 mb-2 text-gray-400" />
            <span className="text-gray-500">이미지를 업로드해주세요</span>
          </label>
        )}
      </div>

      <div className="flex items-center gap-2 p-4">
        <label className="text-sm font-medium">Brush width:</label>
        <input
          type="range"
          min="1"
          max="100"
          value={brushWidth}
          onChange={(e) => setBrushWidth(parseInt(e.target.value))}
          className="w-32"
        />
        <span className="text-sm w-12">{brushWidth}px</span>
      </div>

      <div className="flex gap-2 p-4 overflow-x-auto h-auto">
        {thumbnails.map((thumb, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-20 h-20 border rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleThumbnailClick(thumb)}
          >
            <img
              src={thumb}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <label className="flex-shrink-0 w-20 h-20 flex items-center justify-center border rounded-lg cursor-pointer bg-gray-50">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <ImagePlus className="w-6 h-6 text-gray-400" />
        </label>
      </div>

      <div className="mt-auto p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="수정 사항 입력"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-blue-500">
              <svg
                className="w-6 h-6 rotate-45"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </span>
          </button>
        </div>
        <button className="w-full mt-4 py-3 bg-pink-400 text-white rounded-lg">
          사진 저장
        </button>
      </div>
    </div>
  );
}
