import axios from "axios";
import instance from "./interceptor";

const readRatio = {
    // 나의 서재 페이지 등록 책 전체 조회
    books: async () => {
      try {
        const response = await instance.get("/api/v1/userbook/user");
        console.log(response.data)
        return response.data;
        } catch (error) {
            console.error(error);
        }
    },
}

export { readRatio }