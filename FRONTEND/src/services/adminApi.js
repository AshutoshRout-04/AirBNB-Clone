import axios from "axios";

const BASE_URL = "http://localhost:8086/api/v1";

const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Guests ──────────────────────────────────────────────────────────────────
export const getGuests    = ()  => adminApi.get("/admin/guests");
export const deleteGuest  = (id) => adminApi.delete(`/admin/guests/${id}`);

// ── Hosts ────────────────────────────────────────────────────────────────────
export const getHosts    = ()  => adminApi.get("/admin/hosts");
export const deleteHost  = (id) => adminApi.delete(`/admin/hosts/${id}`);

// ── Properties ───────────────────────────────────────────────────────────────
export const getProperties    = ()  => adminApi.get("/admin/properties");
export const deleteProperty   = (id) => adminApi.delete(`/admin/properties/${id}`);

// ── Bookings ─────────────────────────────────────────────────────────────────
export const getBookings    = ()  => adminApi.get("/admin/bookings");
export const deleteBooking  = (id) => adminApi.delete(`/admin/bookings/${id}`);

export default adminApi;
