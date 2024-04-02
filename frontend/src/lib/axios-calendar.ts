import instance from "./interceptor";

const CalendarApi = {
  // 나의 서재 페이지 등록 책 전체 조회
  // date: async (year: number, month: number) => {
  //   try {
  //     const response = await instance.get(`/api/v1/userbook/date?year=${year}&month=${month}`);
  //     // console.log(response.data)
  //     return response.data;
  //     } catch (error) {
  //         console.error(error);
  //     }
  // },

  date: async (year: number, month: number, userId: number | null = null) => {
    const axiosResponse = await instance.get(
      `/api/v1/userbook/dateV2?year=${year}&month=${month}&userId=${userId}`
    );
    return axiosResponse.data.data;
  },
};

export { CalendarApi };
