import instance from "@/lib/interceptor";

export const uploadToS3 = async (param: FormData) => {
    const axiosResponse = await instance.post('/api/upload', param);
    return axiosResponse.data.data as FileUploadResponse;
}

