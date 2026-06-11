import axios from "axios";

const API_URL = "http://localhost:8086/properties";

export const getAllProperties = () => {
    return axios.get(`${API_URL}/getAll`);
};

export const createProperty = (propertyData) => {
    return axios.post(`${API_URL}/addProperty`, propertyData);
};

// Creates a property linked to a specific host (preferred method)
export const createPropertyForHost = (hostId, propertyData) => {
    return axios.post(`${API_URL}/addProperty/${hostId}`, propertyData);
};


export const updateProperty = (propertyId, propertyData) => {
    return axios.put(`${API_URL}/update/${propertyId}`, propertyData);
};

export const deleteProperty = (propertyId) => {
    return axios.delete(`${API_URL}/delete/${propertyId}`);
};