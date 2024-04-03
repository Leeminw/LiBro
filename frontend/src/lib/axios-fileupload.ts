import instance from "@/lib/interceptor";
import axios from "axios";

const apiClient = axios.create();

export const uploadToS3 = async (param: FormData) => {
    const axiosResponse = await instance.post('/api/upload', param);
    return axiosResponse.data.data as FileUploadResponse;
}

export const uploadToImgbb = async (param: FormData) => {
    const axiosResponse = await apiClient.post('https://api.imgbb.com/1/upload', param);
    return axiosResponse.data.data;
}

export const uploadToBarcodeServer = async (param: FormData) => {
    const axiosResponse = await apiClient.post("/flask/api/v1/isbn", param);
    // const axiosResponse = await apiClient.post('http://j10a301.p.ssafy.io:5000/flask/api/v1/isbn', param);
    return axiosResponse.data.data;
}

