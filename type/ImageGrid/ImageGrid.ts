export interface ImageGridProps {
  images: string[];
  currentImage: string;
  onImageSelect: (image: string, index: number) => void;
  onImageAdd: (file: File) => void;
}
