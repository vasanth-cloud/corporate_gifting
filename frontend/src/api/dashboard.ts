import api from "../services/api";

export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};

export const getMonthlyOrders = async () => {
  const res = await api.get("/dashboard/monthly-orders");
  return res.data;
};

export const getMonthlyRevenue = async () => {
  const res = await api.get("/dashboard/monthly-revenue");
  return res.data;
};

export const getTopGifts = async () => {
  const res = await api.get("/dashboard/top-gifts");
  return res.data;
};

export const getTopCompanies = async () => {
  const res = await api.get("/dashboard/top-companies");
  return res.data;
};

export const getOrderStatus = async () => {
  const res = await api.get("/dashboard/order-status");
  return res.data;
};