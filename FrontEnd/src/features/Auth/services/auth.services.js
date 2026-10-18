import api from "./api.js";

export const getMe=async ()=>{

    const response=await api.get("/user/me");

    return response.data;

}

export const login = async (credentials) => {
  const response = await api.post("/user/login", credentials);
  return response.data.user;
};

export const register = async (credentials) => {
  const response = await api.post("/user/register", credentials);
  return response.data.user;
};

export const logout = async () => {
  await api.post("/user/logout");
};