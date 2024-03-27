import axios from "axios";
import instance from "./interceptor";

const Calendar = {
    // 나의 서재 페이지 등록 책 전체 조회
    date: async (year: number, month: number) => {
      try {
        const response = await instance.get(`/api/v1/userbook/date?year=${year}&month=${month}`);
        // console.log(response.data)
        return response.data;
        } catch (error) {
            console.error(error);
        }
    },
}

export { Calendar }