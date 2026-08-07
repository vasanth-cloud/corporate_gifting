import api from "../services/api";

export interface OrderReportData {
  total_orders: number;
  pending_orders: number;
  approved_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
}

export interface CampaignReportData {
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
}

export interface EmployeeReportData {
  total_employees: number;
}

export interface RevenueReportData {
  total_revenue: number;
}

export const getOrderReport = async (): Promise<OrderReportData> => {
  const res = await api.get("/reports/orders");
  return res.data;
};

export const getCampaignReport = async (): Promise<CampaignReportData> => {
  const res = await api.get("/reports/campaigns");
  return res.data;
};

export const getEmployeeReport = async (): Promise<EmployeeReportData> => {
  const res = await api.get("/reports/employees");
  return res.data;
};

export const getRevenueReport = async (): Promise<RevenueReportData> => {
  const res = await api.get("/reports/revenue");
  return res.data;
};
