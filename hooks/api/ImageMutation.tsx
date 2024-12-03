import postImage from "@/app/_api/Image/postImage";
import { useMutation } from "@tanstack/react-query";

interface ImageUploadData {
  image_url: string;
  instruction: string;
}

interface ImageMutationResult {
  output_image: string;
  isLoading: boolean;
}

interface ImageMutationOptions {
  onSuccess?: (data: ImageMutationResult) => void;
  onError?: (error: unknown) => void;
}

const ImageMutation = (options?: ImageMutationOptions) => {
  return useMutation<ImageMutationResult, Error, ImageUploadData>({
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
