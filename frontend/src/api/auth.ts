import api from "../services/api";

export const loginUser = async (
  email: string,
  password: string
) => {
  const data = new URLSearchParams();

  data.append("username", email);
  data.append("password", password);

  const response = await api.post(
    "/auth/login",
    data,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  console.log("API Response", response);

  return response.data;
};