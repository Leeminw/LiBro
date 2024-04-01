import instance from "@/lib/interceptor";
import axios from "axios";

const client = axios.create()

export const uploadToS3 = async (param: FormData) => {
    const axiosResponse = await instance.post('/api/upload', param);
    return axiosResponse.data.data as FileUploadResponse;
}

export const uploadToImgbb = async (param: FormData) => {
    const axiosResponse = await client.post('https://api.imgbb.com/1/upload', param);
    return axiosResponse.data.data;
}

export const uploadToBarcodeServer = async (param: FormData) => {
    const axiosResponse = await client.post('http://j10a301.p.ssafy.io:5000/flask/api/v1/isbn', param);
    return axiosResponse.data.data;
}

