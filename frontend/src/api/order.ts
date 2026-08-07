import api from "../services/api";

export interface Order {
  id?: number;
  order_number: string;
  company_id: number;
  employee_id: number;
  campaign_id: number;
  order_date: string;
  total_amount: number;
  status: "PENDING" | "APPROVED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const getOrder = async (id: number) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const createOrder = async (data: Order) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const updateOrder = async (id: number, data: Partial<Order>) => {
  const res = await api.put(`/orders/${id}`, data);
  return res.data;
};

export const deleteOrder = async (id: number) => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};

export const downloadInvoice = async (orderId: number) => {
  const res = await api.get(`/orders/${orderId}/invoice`, {
    responseType: "blob",
  });
  return res.data;
};
