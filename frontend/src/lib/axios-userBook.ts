import axios from "axios";
import instance from "./interceptor";

const userBooks = {
  // 나의 서재 페이지 등록 책 전체 조회
  books: async () => {
    try {
      const response = await instance.get("/api/v1/userbook/user");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  // 나의 서재 페이지 등록 책 특정(디테일) 조회
  bookDetail: async () => {
    const userBookId = 1; // 변경 필
    try {
      const response = await instance.get(
        `/api/v1/userbook/detail/${userBookId}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  // 책 등록
  bookPost: async (bookId: number, type: string) => {
    try {
      const response = await instance.get("/api/v1/userbook");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  // 책 등록 취소
  bookDelete: async (userBookId: number) => {
    try {
      const response = await instance.delete(`/api/v1/userbook/${userBookId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  bookContain: async (id: number) => {
    try {
      const response = await instance.get(`/api/v1/userbook/contain`, {
        params: {
          bookId:id
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export { userBooks };
