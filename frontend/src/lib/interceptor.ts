import axios from "axios";
import useUserState from "@/lib/login-state";
const instance = axios.create({
  baseURL: "http://localhost:8080",
});

const apiclient = axios.create({
  baseURL: "http://localhost:8080",
});
instance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("accessToken")}`;
    return config;
  },
  (error) => {
    console.log("request error", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      try {
        const response = await apiclient.post(
          "/api/token/refresh",
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("refreshToken"),
            },
          }
        );
        const accessToken = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        const originRequest = await axios.request(error.config);
        return originRequest;
      } catch (error_) {
        return Promise.reject(error_);
      }
    }
    console.log("error", error);
    return Promise.reject(error);
  }
);

export default instance;
