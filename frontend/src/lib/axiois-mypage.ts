import instance from '@/lib/interceptor'

// 사용자 정보 조회
export const getUserInform = async (
    userId: number,
) => {
    const axiosResponse = await instance.get(`/api/user/load`);
    return axiosResponse.data.data
}

// 등록도서, 완독률 조회
export const getCompleteRatio = async () => {
    const axiosResponse = await instance.get(`/api/v1/userbook/read-ratio/user`);
    return axiosResponse.data.data
}

// 완독한 도서 리스트 조회
export const getCompleteBookList = async () => {
    const axiosResponse = await instance.get(`/api/v1/userbook/complete`);
    return axiosResponse.data.data
}

// 글귀 데이터 읽어오기
export const getWrittenComment = async () => {
    const axiosResponse = await instance.get(`/api/v1/userbook/user/commentList`);
    return axiosResponse.data.data
}
