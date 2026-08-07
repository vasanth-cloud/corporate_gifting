import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/v1";

export async function validateVoucher(code: string) {
  const response = await axios.get(`${API_BASE}/vouchers/validate/${code}`);
  return response.data;
}

export async function claimVoucher(payload: {
  code: string;
  gift_id: number;
  shipping_address: string;
  phone: string;
}) {
  const response = await axios.post(`${API_BASE}/vouchers/claim`, payload);
  return response.data;
}
