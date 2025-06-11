import axios from "axios";
import { API_BASE } from "./api";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE}/auth/login`, credentials);
  // Wrap the response so AuthContext gets { user, token }
  const { token, ...user } = response.data;
  return { user, token };
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE}/auth/register`, userData);
  const { token, ...user } = response.data;
  return { user, token };
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
