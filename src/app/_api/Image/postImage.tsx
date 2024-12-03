import axios from "axios";

const postImage = async (body: object) => {
  const { data } = await axios.post("http://127.0.0.1:5001/edit-image", body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
export default postImage;
