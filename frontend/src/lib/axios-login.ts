import axios from "axios";
const apiClient = axios.create();
const LoginApi = {
  loginUser: async (token: string) => {
    try {
      const response = await apiClient.get(
        "http://localhost:8080/api/user/load",
        {
          headers:{
            Authorization: "Bearer "+token
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  logoutUser: async (token: string) => {
    try {
      const response = await apiClient.get(
        "http://localhost:8080/api/user/token/logout",
        {
          headers:{
            Authorization: token
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export { LoginApi };
