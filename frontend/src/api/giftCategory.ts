import api from "../services/api";

export const getGiftCategories = async () => {
  const res = await api.get("/gift-categories");
  return res.data;
};

export const getGiftCategory = async (id: number) => {
  const res = await api.get(`/gift-categories/${id}`);
  return res.data;
};

export const createGiftCategory = async (data: any) => {
  const res = await api.post("/gift-categories", data);
  return res.data;
};

export const updateGiftCategory = async (
  id: number,
  data: any
) => {
  const res = await api.put(`/gift-categories/${id}`, data);
  return res.data;
};

export const deleteGiftCategory = async (id: number) => {
  const res = await api.delete(`/gift-categories/${id}`);
  return res.data;
};