import axios from "axios";

const BASE_URL = "http://localhost:8086/api/v1/reviews";

export const createReview = (reviewData) => {
  return axios.post(BASE_URL, reviewData);
};

export const getReviewsByProperty = (propertyId) => {
  return axios.get(`${BASE_URL}/property/${propertyId}`);
};

export const getReviewsByGuest = (guestId) => {
  return axios.get(`${BASE_URL}/guest/${guestId}`);
};

export const hasReviewedBooking = (bookingId) => {
  return axios.get(`${BASE_URL}/booking/${bookingId}/exists`);
};

/** Returns { rating: number|null, count: number } for a property */
export const getRatingSummary = (propertyId) => {
  return axios.get(`${BASE_URL}/summary/${propertyId}`);
};
