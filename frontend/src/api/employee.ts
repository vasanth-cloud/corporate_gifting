import api from "../services/api";

export const getEmployees = async () => {
  const res = await api.get("/employees");
  return res.data;
};

export const getEmployee = async (id: number) => {
  const res = await api.get(`/employees/${id}`);
  return res.data;
};

export const createEmployee = async (data: any) => {
  const res = await api.post("/employees", data);
  return res.data;
};

export const updateEmployee = async (
  id: number,
  data: any
) => {
  const res = await api.put(`/employees/${id}`, data);
  return res.data;
};

export const deleteEmployee = async (
  id: number
) => {
  const res = await api.delete(`/employees/${id}`);
  return res.data;
};