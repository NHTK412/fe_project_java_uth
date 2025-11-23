/* eslint-disable no-undef */
import axios from "axios";

const API_URL = "http://localhost:8080/file-upload/image";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // trả về URL ảnh
};

export default { uploadImage };
