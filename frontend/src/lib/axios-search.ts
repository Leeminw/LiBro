import axios from "axios";

const createProxyMiddleware = require('http-proxy-middleware');


const apiClient = axios.create({
  headers: {
    "X-Naver-Client-Id": "1BtBosOmbcBO2P6B8RU5",
    "X-Naver-Client-Secret": "arF4s6wdY9",
  },
});
const SearchApi = {
  searchBooks: async (query: string, start: number) => {
    try {
      const response = await apiClient.get(
        "/v1/search/book.json",
        {
          params:{
            query: query,
            start: start,
            display: 51,
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export { SearchApi };
