import axios from "axios";

const postImage = async (formData: FormData) => {
  try {
    const { data } = await axios.post(
      "http://0.0.0.0:5002/api/edit-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // axios가 FormData를 자동으로 처리하도록 설정
        transformRequest: [
          function (data) {
            return data; // FormData를 그대로 반환
          },
        ],
      }
    );
    return data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
};

export default postImage;
