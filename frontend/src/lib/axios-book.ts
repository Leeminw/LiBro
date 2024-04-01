import axios from "axios";
import instance from "./interceptor";

const booksApi = {
  // 나의 서재 페이지 등록 책 전체 조회
  bookSearch: async (key: string, word: string | null, page: number, size: number) => {
    try {
      const response = await axios.get("/api/v1/book/search", {
        params: {
          key: key,
          word: word,
          page: page,
          size: size,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  registerBook: async (addBook: AddBook) => {
    try {
      const response = await axios.post("/api/v1/book", addBook);
      const data = response?.data.data || response.data.data[0];
      console.log(data);
      const bookId = data.id;
      // 이미 되어있는지 확인하기 todo
      console.log(bookId);
      return bookId;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  userBookMapping: async (value: MappingBook) => {
    try {
      const response = await instance.post("/api/v1/userbook", value);
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },

  bookRatio: async (value: number) => {
    try {
      const response = await axios.get(`
      /api/v1/userbook/read-ratio/book/${value}`)
      console.log(response.data)
      return response
    }
    catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },

  bookAgeGender: async (value: number) => {
    try {
      const response = await axios.get(`
      /api/v1/userbook/age-gender/book/${value}`)
      return response
    }
    catch (error) {
      console.error(error);
      return Promise.reject(error);
    }

  },
  ratingCount: async (value: number) => {
    try {
      const response = await axios.get(
        `/api/v1/userbook/rating/summary/${value}`
      )
      return response
    }
    catch (error) {
      console.error(error);
      return Promise.reject(error)
    }
  },
  ratincComment: async (value: number) => {
    try {
      const response = await axios.get(
        `/api/v1/userbook/rating/comment/${value}`
      )
      return response
    }
    catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

};

export default booksApi;
