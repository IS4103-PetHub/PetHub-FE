import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DEV_API_URL + "/api",
});

api.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await axios.get("/api/auth/jwt");
      if (data.token) {
        // console.log("api/axiosConfig: Token from axios interceptor", data.token);
        config.headers.Authorization = `Bearer ${data.token}`;
      }
    } catch (error) {
      // console.log(
      //   "api/axiosConfig: Error fetching token in interceptor, this is likely due to there being no active session"
      // );
    }
    // console.log("Sent headers", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
