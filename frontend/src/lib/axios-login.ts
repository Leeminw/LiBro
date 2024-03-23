import axios from "axios";
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});
const LoginApi = {
  loadUser: async (token: string) => {
    try {
      console.log("token", token);
      const response = await apiClient.get("/api/user/load", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  logoutUser: async (token: string) => {
    try {
      const response = await apiClient.get("/api/token/logout", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  test: async (token: string) => {
    try {
      const response = await apiClient.get("/api/user/test", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export { LoginApi };
