import axios from "axios";

const API_URL = "http://localhost:8086/user";
const AUTH_URL = "http://localhost:8086/auth";

export const getUserById = (id) => {
  return axios.get(`${API_URL}/getUser/${id}`);
};

export const getUserByEmail = (email) => {
  return axios.get(`${API_URL}/getByEmail/${email}`);
};

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/public/register`, userData);
};

export const updateUser = (id, userData) => {
  return axios.put(`${API_URL}/updateUser/${id}`, userData);
};

export const loginUser = (email, password) => {
  return axios.post(`${AUTH_URL}/login`, { email, password });
};

export const becomeHost = (userId) => {
  return axios.post(`${API_URL}/become-host/${userId}`);
};
