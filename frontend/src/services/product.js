// frontend/src/services/products.js
import axios from "axios";
import { API_BASE } from "./api";

// GET ALL PRODUCTS
export const getProducts = async () => {
  const response = await axios.get(`${API_BASE}/products`);
  return response.data;
};

// GET SINGLE PRODUCT
export const getProductById = async (id) => {
  const response = await axios.get(`${API_BASE}/products/${id}`);
  return response.data;
};

// CREATE PRODUCT
export const createProduct = async (productData) => {
  const response = await axios.post(`${API_BASE}/products`, productData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// UPDATE PRODUCT
export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_BASE}/products/${id}`, productData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_BASE}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};
