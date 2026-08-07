import api from "../services/api";

export const exportOrdersExcel = async () => {
  const res = await api.get("/export/orders/excel", {
    responseType: "blob",
  });
  return res.data;
};

export const exportOrdersPdf = async () => {
  const res = await api.get("/export/orders/pdf", {
    responseType: "blob",
  });
  return res.data;
};
