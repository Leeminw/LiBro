import axios, {AxiosRequestConfig} from "axios"
// import queryInstance from '@/lib/interceptor'
// import mutationInstance from "@/lib/interceptor-json";

const baseURL = 'http://localhost:8080/api'

const mutationInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json"
    }
})

const queryInstance = axios.create({
    baseURL: baseURL,
})


export const getCategoryList = async (
    clubId: number,
): Promise<Category[]> => {
    const axiosResponse = await queryInstance.get(`/board/list/${clubId}`);
    return axiosResponse.data.data
};

export const writeCategory = async (
    param: CategoryWrite
) => {
    const axiosResponse = await mutationInstance.post("/board", param);
    return axiosResponse.data.data
}

export const updateCategory = async (
    param: CategoryUpdate
) => {
    const axiosResponse = await mutationInstance.put("/board", param);
    return axiosResponse.data.data
}

export const deleteCategory = async (
    boardId: number
) => {
    const axiosResponse = await mutationInstance.delete(`/board/${boardId}`);
    return axiosResponse.data.data
}

export const writePost = async (
    param: PostWrite
) => {
    const axiosResponse = await mutationInstance.post(`/article`, param)
    return axiosResponse.data.data
}

export const getPostDetail = async (
    postId: number,
): Promise<PostDetail> => {
    const axiosResponse = await queryInstance.get(`/article/${postId}`);
    return axiosResponse.data.data
};


export const editPost = async (
    postId: number,
    param: PostWrite
) => {
    const axiosResponse = await mutationInstance.put(`/article/${postId}`, param)
    return axiosResponse.data.data
}

export const deletePost = async (
    postId: number,
): Promise<PostDetail> => {
    const axiosResponse = await mutationInstance.delete(`/article/${postId}`);
    return axiosResponse.data.data
};


export const deleteComment = async (
    commentId: number
) => {
    const axiosResponse = await mutationInstance.delete(`/comment/${commentId}`);
    return axiosResponse.data.data
};

export const updateComment = async (
    commentId: number,
    param: CommentWrite
) => {
    const axiosResponse = await mutationInstance.put(`/comment/${commentId}`, param)
    return axiosResponse.data.data
}

export const writeComment = async (
    param: CommentWrite
) => {
    const axiosResponse = await mutationInstance.post(`/comment`, param)
    return axiosResponse.data.data
}

export const getCommentList = async (
    boardId: number
) => {
    const axiosResponse = await queryInstance.get(`/comment/${boardId}`);
    return axiosResponse.data.data
}

export const getPostList = async (
    clubId: number,
    params?: PostSearch
) => {
    let axiosParams: AxiosRequestConfig | undefined;
    if (params) {
        axiosParams = {params};
    }
    const axiosResponse = await queryInstance.get(`/article/list/${clubId}`, axiosParams);
    return axiosResponse.data.data
}

export const getClubList = async (
    params?: ClubSearch
) => {
    let axiosParams: AxiosRequestConfig | undefined;
    if (params) {
        axiosParams = {params};
    }
    const axiosResponse = await queryInstance.get(`/usergroup/list`, axiosParams);
    return axiosResponse.data.data
}

export const getMyClubList = async (
    userId: number,
    params?: ClubSearch
) => {
    let axiosParams: AxiosRequestConfig | undefined;
    if (params) {
        axiosParams = {params};
    }
    const axiosResponse = await queryInstance.get(`/usergroup/myClubList?userId=${userId}`, axiosParams);
    return axiosResponse.data.data
}


export const writeClub = async (
    param: ClubWrite
) => {
    const axiosResponse = await mutationInstance.post(`/club`, param)
    return axiosResponse.data.data
}

export const updateClub = async (
    clubId: number,
    param: ClubWrite
) => {
    console.log(`/club/${clubId}`)
    const axiosResponse = await mutationInstance.put(`/club/${clubId}`, param)
    return axiosResponse.data.data
}

export const deleteClub = async (
    clubId: number,
) => {
    const axiosResponse = await mutationInstance.delete(`/club/${clubId}`)
    return axiosResponse.data.data
}


export const getClubDetail = async (
    clubId: number
) => {
    const axiosResponse = await queryInstance.get(`/usergroup/${clubId}`);
    return axiosResponse.data.data
}

export const getClubSummary = async (
    clubId: number,
) => {
    const axiosResponse = await mutationInstance.get(`/usergroup/summary/${clubId}`);
    return axiosResponse.data.data
}

export const joinClub = async (
    clubId: number,
    param: ClubJoin
) => {
    const axiosResponse = await mutationInstance.post(`/usergroup/${clubId}/join`, param)
    return axiosResponse.data.data
}

export const leaveClub = async (
    clubId: number,
    userId: number,
) => {
    const axiosResponse = await mutationInstance.delete(`/usergroup/${clubId}/members/${userId}`)
    return axiosResponse.data.data
}

export const getClubMemberList = async (
    clubId: number
) => {
    const axiosResponse = await queryInstance.get(`/usergroup/${clubId}/members`)
    return axiosResponse.data.data
}

export const getClubMemberShip = async (
    clubId: number,
    userId: number
) => {

    const axiosResponse = await queryInstance.get(`/usergroup/hasPermission/${clubId}/${userId}`)
    return axiosResponse.data.data
}
