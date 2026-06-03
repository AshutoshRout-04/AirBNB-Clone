import axios from "axios";

const API_URL = "http://localhost:8086/properties/getAll";

export const getAllProperties = () => {
    return axios.get(API_URL);
};