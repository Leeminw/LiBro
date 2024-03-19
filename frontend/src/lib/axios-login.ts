import axios from "axios";
const apiClient = axios.create();
const LoginApi = {
  loginUser: async (code: string) => {
    try {
      const response = await apiClient.post(
        "http://localhost:8080/api/user/login",
        {
          token: code,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export { LoginApi };
