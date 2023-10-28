import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DEV_API_URL + "/api",
});

api.interceptors.request.use(
  async (config) => {
    // console.log("INTERCEPTING FOR", config.url);
    try {
      const { data } = await axios.get("/api/auth/jwt");
      if (data.token) {
        // console.log("\napi/axiosConfig: Token from axios interceptor", data.token);
        config.headers.Authorization = `Bearer ${data.token}`;
      }
    } catch (error) {
      // console.log(
      //   "\napi/axiosConfig: Error fetching token in interceptor, this is likely due to there being no active session",
      // );
    }
    // console.log(`\nSent headers for url ${config.url}`, config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
