import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  (import.meta.env.PROD
    ? "https://notes-keeper-4fw6.onrender.com/api"
    : "http://localhost:3000/api");

    
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;