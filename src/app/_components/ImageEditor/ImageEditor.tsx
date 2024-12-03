import ImageCanvas from "./ImageCanvas/ImageCanvas";
import useImageEditor from "../../../../hooks/ImageEdtor/useImageEditor";
import ImageThumbnails from "./ImageThumbnails/ImageThumbnails";
import ImageProcessingControls from "./ImageProcessingControls/ImageProcessingControls";
const ImageEditor: React.FC = () => {
  const {
    previewImage,
    thumbnails,
    text,
    isLoading,
    outputPath,
    brushWidth,
    containerRef,
    canvasRef,
    contextRef,
    imageRef,
    handleImageUpload,
    handleThumbnailClick,
    handleSubmit,
    setBrushWidth,
    setText,
    handleImageSave,
  } = useImageEditor();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ImageCanvas
        containerRef={containerRef}
        canvasRef={canvasRef}
        previewImage={previewImage}
        isLoading={isLoading}
        imageRef={imageRef}
        contextRef={contextRef}
        onImageUpload={handleImageUpload}
      />

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

      <ImageThumbnails
        thumbnails={thumbnails}
        onThumbnailClick={handleThumbnailClick}
        onImageUpload={handleImageUpload}
      />

      <div className="mt-30 p-4">
        {outputPath && (
          <div className="mb-4 p-2 bg-green-100 rounded-lg">
            <p className="text-green-800">
              이미지가 성공적으로 반환되었습니다.
            </p>
            <img src={outputPath} alt="outputPath" />
          </div>
        )}

        <ImageProcessingControls
          text={text}
          isLoading={isLoading}
          onTextChange={setText}
          onSubmit={handleSubmit}
          handleImageSave={handleImageSave}
        />
      </div>
    </div>
  );
};

export default ImageEditor;
