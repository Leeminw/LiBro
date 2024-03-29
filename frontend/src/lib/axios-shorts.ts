import axios from "axios";
import instance from "./interceptor";
import useUserState from "./login-state";
const apiClient = axios.create();

const ShortsApi = {
  loadShorts: async () => {
    try {
      const response = await apiClient.get("/flask/api/v1/recommend");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export { ShortsApi };
