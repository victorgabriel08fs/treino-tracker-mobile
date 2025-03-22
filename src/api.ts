import dotenv from "dotenv";
import axios from "axios";

let api = null;
const API_URL = "/api";
if (import.meta.env.VITE_API_URL) {
  api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default api;
