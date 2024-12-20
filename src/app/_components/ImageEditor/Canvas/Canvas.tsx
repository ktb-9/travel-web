import { CanvasProps } from "../../../../../type/Canvas/Canvas";

export const Canvas: React.FC<CanvasProps> = ({
  displayCanvasRef,
  canvasRef,
  maskCanvasRef,
  onStartDrawing,
  onDrawing,
  onStopDrawing,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="bg-gray-50 rounded-lg flex items-center justify-center min-h-[60vh]">
        <canvas
          ref={displayCanvasRef}
          onMouseDown={onStartDrawing}
          onMouseMove={onDrawing}
          onMouseUp={onStopDrawing}
          onMouseOut={onStopDrawing}
          onTouchStart={onStartDrawing}
          onTouchMove={onDrawing}
          onTouchEnd={onStopDrawing}
          className="cursor-crosshair touch-none max-w-full max-h-full rounded-lg"
        />
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={maskCanvasRef} className="hidden" />
      </div>
    </div>
  );
};
