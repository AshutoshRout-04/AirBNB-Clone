import axios from "axios";

const HOST_API = "http://localhost:8086/Host";

/**
 * Get the Host profile for a given User ID.
 * Returns the host entity (including host.id) so the frontend can
 * pass hostId when creating or managing properties.
 */
export const getHostByUserId = (userId) => {
    return axios.get(`${HOST_API}/getByUser/${userId}`);
};

/**
 * Get the Host profile by Host ID.
 */
export const getHostById = (hostId) => {
    return axios.get(`${HOST_API}/get/${hostId}`);
};

/**
 * Get all hosts (for admin / listing purposes).
 */
export const getAllHosts = () => {
    return axios.get(`${HOST_API}/getall`);
};
