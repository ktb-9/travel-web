export interface Position {
  x: number;
  y: number;
}

export interface DrawingState {
  maskData: ImageData; // 마스크 캔버스의 이미지 데이터
  previewData: ImageData; // 프리뷰 캔버스의 이미지 데이터
}

export type EditMode = "edit" | "remove"; // 편집 모드 (일반 편집/지우기)
export type SelectedTool = "brush" | "rectangle"; // 선택된 도구 (브러시/사각형)
