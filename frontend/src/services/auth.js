import axios from "axios";
import { API_BASE } from "./api";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE}/auth/login`, credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE}/auth/register`, userData);
  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
