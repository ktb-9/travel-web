import postImage from "@/app/_api/Image/postImage";
import { useMutation } from "@tanstack/react-query";

interface ImageMutationResult {
  output_image: string;
  isLoading: boolean;
}

interface ImageMutationOptions {
  onSuccess?: (data: ImageMutationResult) => void;
  onError?: (error: unknown) => void;
}

const ImageMutation = (options?: ImageMutationOptions) => {
  return useMutation<ImageMutationResult, Error, FormData>({
    // FormData 타입으로 변경
    mutationFn: postImage,
    onSuccess: (data) => {
      console.log(data.output_image);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export default ImageMutation;
