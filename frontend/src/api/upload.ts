import api from "../services/api";

export const uploadFile = async (type: "company" | "gift" | "employee", file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(`/upload/${type}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data; // returns { filename: string, url: string }
};
