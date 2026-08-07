import api from "../services/api";

export interface Campaign {
  id?: number;
  title: string;
  description?: string;
  budget: number;
  start_date: string;
  end_date: string;
  status?: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  company_id: number;
  created_at?: string;
  updated_at?: string;
}

export const getCampaigns = async () => {
  const res = await api.get("/campaigns");
  return res.data;
};

export const getCampaign = async (id: number) => {
  const res = await api.get(`/campaigns/${id}`);
  return res.data;
};

export const createCampaign = async (data: Campaign) => {
  const res = await api.post("/campaigns", data);
  return res.data;
};

export const updateCampaign = async (id: number, data: Partial<Campaign>) => {
  const res = await api.put(`/campaigns/${id}`, data);
  return res.data;
};

export const deleteCampaign = async (id: number) => {
  const res = await api.delete(`/campaigns/${id}`);
  return res.data;
};
