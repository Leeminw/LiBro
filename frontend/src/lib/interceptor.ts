import axios from "axios";
const instance = axios.create({
  baseURL: "https://j10a301.p.ssafy.io",
});

const apiclient = axios.create({
  baseURL: "https://j10a301.p.ssafy.io",
});

instance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("accessToken")}`;
    console.log("request : ", config);
    return config;
  },
  (error) => {
    console.log("request error", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (response) => {
    console.log("response : ", response);
    return response;
  },
  async (error) => {
    console.log("resonse error : ", error);
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
