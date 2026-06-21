import axios from "axios";

const API_URL = "http://localhost:8086/api/v1/bookings";

export const createBooking = (bookingData) => {
  return axios.post(API_URL, bookingData);
};

export const getAllBookings = () => {
  return axios.get(API_URL);
};

export const getBookingsByUserId = (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};

export const getBookingsByHostId = (hostId) => {
  return axios.get(`${API_URL}/host/${hostId}`);
};

export const updateBooking = (bookingId, bookingData) => {
  return axios.put(`${API_URL}/${bookingId}`, bookingData);
};

export const updateBookingStatus = (bookingId, status) => {
  return axios.patch(`${API_URL}/${bookingId}/status?status=${status}`);
};

export const deleteBooking = (bookingId) => {
  return axios.delete(`${API_URL}/${bookingId}`);
};

