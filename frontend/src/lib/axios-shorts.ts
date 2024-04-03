import axios from "axios";
import instance from "./interceptor";
import useUserState from "./login-state";
const apiClient = axios.create();

const ShortsApi = {
  loadShorts: async (isLogin:boolean) => {
    if(isLogin) {
      try {
        const response = await instance.get("/flask/api/v1/recommend");
        return response.data;
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await apiClient.get("/flask/api/v1/recommend");
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  },
};

export { ShortsApi };
