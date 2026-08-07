import api from "../services/api";

export const loginUser = async (email: string, password: string) => {
  const data = new URLSearchParams();
  data.append("username", email);
  data.append("password", password);

  const response = await api.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

export const registerUser = async (userData: {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
}) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};