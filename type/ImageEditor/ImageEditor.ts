import { ChangeEvent } from "react";

export interface FileInputEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}
export interface ImageParams {
  userId: number;
}
export interface ImageCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  previewImage: string | null;
  isLoading: boolean;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  contextRef: React.RefObject<CanvasRenderingContext2D | null>;
  onImageUpload: (e: FileInputEvent) => void;
}
export interface ImageThumbnailsProps {
  thumbnails: string[];
  onThumbnailClick: (imageUrl: string) => void;
  onImageUpload: (e: FileInputEvent) => void;
}
export interface ImageProcessingControlsProps {
  text: string;
  isLoading: boolean;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
  handleImageSave: () => void;
}
