import dotenv from "dotenv";
import axios from "axios";

let api = null;
if (import.meta.env.VITE_API_URL) {
  api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default api;
