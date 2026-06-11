import axios from "axios";

const API_URL = "http://localhost:8086/api/v1/bookings";

export const createBooking = (bookingData) => {
  return axios.post(API_URL, bookingData);
};

export const getAllBookings = () => {
  return axios.get(API_URL);
};

export const deleteBooking = (bookingId) => {
  return axios.delete(`${API_URL}/${bookingId}`);
};
