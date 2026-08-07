import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export async function createPaymentOrder(orderId: number, paymentMethod: string) {
  const response = await axios.post(
    `${API_BASE}/payments/create-order`,
    { order_id: orderId, payment_method: paymentMethod },
    authHeader()
  );
  return response.data;
}

export async function verifyPayment(paymentId: string, orderId: number, status = "SUCCESS") {
  const response = await axios.post(
    `${API_BASE}/payments/verify`,
    { payment_id: paymentId, order_id: orderId, status },
    authHeader()
  );
  return response.data;
}
