import axios from "axios";
import useUserState from "./login-state";
import {redirect} from "next/navigation";

const CUDInstance = axios.create({
    baseURL: "http://localhost:8080",
});

CUDInstance.interceptors.request.use(
    (config) => {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem("accessToken")}`;
        config.headers["Content-Type"] = "application/json"; // JSON 형식으로 요청 보내기
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

CUDInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originRequest = error.config;
        if (error.response.status === 400 && !originRequest.retry) {
            originRequest.retry = true;
            try {
                const response = await axios.post("/api/token/refresh", {
                    refreshToken: localStorage.getItem("refreshToken"),
                });
                const {accessToken} = response.data;
                localStorage.setItem("accessToken", accessToken);
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                return CUDInstance(originRequest);
            } catch (e) {
                useUserState().deleteUserInfo();
                redirect("/");
            }
        }
        return Promise.reject(error);
    }
);

export default CUDInstance;
