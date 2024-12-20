export interface CanvasProps {
  displayCanvasRef: React.RefObject<HTMLCanvasElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  maskCanvasRef: React.RefObject<HTMLCanvasElement>;
  onStartDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  onDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  onStopDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
}
