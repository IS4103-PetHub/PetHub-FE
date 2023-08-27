import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DEV_API_URL + "/api",
});

api.interceptors.request.use(
  (config) => {
    // For future use: Do something before a request is sent, e.g. append auth headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
