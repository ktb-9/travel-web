import { useCallback, useEffect, useRef, useState } from "react";
import ImageMutation from "../api/ImageMutation";
import {
  FileInputEvent,
  ImageParams,
} from "../../type/ImageEditor/ImageEditor";
import postImageLink from "@/app/_api/Image/postImageLink";

const useImageEditor = () => {
  // 네이티브에서 가져오는 파라미터
  const [params, setParams] = useState<ImageParams | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    "/api/placeholder/400/500"
  );
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // ai에서 리턴한 이미지
  const [outputPath, setOutputPath] = useState<string | null>(null);

  // 브러쉬 크기 조절
  const [brushWidth, setBrushWidth] = useState(40);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ai에게 이미지 변화 요청
  const { mutate } = ImageMutation({
    onSuccess: (data) => {
      setIsLoading(false);
      if (data && data.output_image) {
        setOutputPath(data.output_image);
        setThumbnails((prev) => [...prev, data.output_image]);
      }
    },
    onError: () => {
      setIsLoading(false);
      alert("이미지 업로드 실패");
    },
  });

  const getInfo = useCallback((event: MessageEvent) => {
    //네이티브에서 전달한 정보 파싱
    const { userId } = JSON.parse(event.data);
    setParams(userId);
  }, []);

  useEffect(() => {
    window.addEventListener("message", getInfo);
    return () => window.removeEventListener("message", getInfo);
  }, []);

  const handleImageUpload = useCallback((e: FileInputEvent): void => {
    const uploadImage = async () => {
      const file = e.target.files?.[0];
      const formData = new FormData();
      if (file) {
        formData.append("thumbnail", file);
      }
      try {
        const response = await postImageLink(1, formData);
        setThumbnails((prev) => [...prev, response.thumbnailUrl]);
        setPreviewImage(response.thumbnailUrl);
      } catch (error) {
        console.error("이미지 업로드 실패", error);
      }
    };

    uploadImage();
  }, []);
  const handleThumbnailClick = useCallback((imageUrl: string) => {
    setPreviewImage(imageUrl);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!previewImage) {
      alert("Please upload an image first");
      return;
    }

    setIsLoading(true);

    const body = {
      image_url: previewImage,
      instruction: text,
    };

    mutate(body);
  }, [previewImage, text, mutate]);

  const handleImageSave = useCallback(() => {
    if (!outputPath) {
      alert("No processed image to save");
      return;
    }

    const link = document.createElement("a");
    link.href = outputPath;
    link.download = `processed-image-${Date.now()}.jpg`;
    link.click();
  }, [outputPath]);

  return {
    // 상태
    params,
    previewImage,
    thumbnails,
    text,
    isLoading,
    outputPath,
    brushWidth,

    // Refs
    containerRef,
    canvasRef,
    contextRef,
    imageRef,

    // 함수
    handleImageUpload,
    handleThumbnailClick,
    handleSubmit,
    handleImageSave,
    setBrushWidth,
    setText,
  };
};
export default useImageEditor;
