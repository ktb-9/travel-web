import React from "react";
import { ImageProcessingControlsProps } from "../../../../../type/ImageEditor/ImageEditor";

export default function ImageProcessingControls({
  text,
  isLoading,
  onTextChange,
  onSubmit,
  handleImageSave,
}: ImageProcessingControlsProps) {
  return (
    <>
      <div className="relative">
        <input
          value={text}
          type="text"
          placeholder="수정 사항 입력"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onTextChange(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={onSubmit}
          disabled={isLoading}
        >
          <span className={`${isLoading ? "text-gray-400" : "text-blue-500"}`}>
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
      <button
        className="w-full mt-4 py-3 bg-pink-400 text-white rounded-lg"
        onClick={handleImageSave}
        disabled={isLoading}
      >
        사진 저장
      </button>
    </>
  );
}
