import axios from "axios";

const postImageLink = async (userId: number, body: object) => {
  const { data } = await axios.post(
    `https://server.zero-dang.com/image/${userId}`,
    body,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};
export default postImageLink;
