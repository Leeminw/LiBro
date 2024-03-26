import axios, {AxiosRequestConfig} from "axios"
// import instance from '@/lib/interceptor'

const baseURL = 'http://localhost:8080/api'

const config = {
    headers: {
        'Content-Type': 'application/json',
    }
};

const instance = axios.create({
    baseURL: baseURL,
})


export const getCategoryList = async (
    clubId: number,
): Promise<Category[]> => {
    const axiosResponse = await instance.get(`/board/list/${clubId}`);
    return axiosResponse.data.data
};

export const writeCategory = async (
    param: CategoryWrite
) => {
    const axiosResponse = await instance.post("/board", param, config);
    return axiosResponse.data.data
}

export const updateCategory = async (
    param: CategoryUpdate
) => {
    const axiosResponse = await instance.put("/board", param, config);
    return axiosResponse.data.data
}

export const deleteCategory = async (
    boardId: number
) => {
    const axiosResponse = await instance.delete(`/board/${boardId}`, config);
    return axiosResponse.data.data
}

export const writePost = async (
    param: PostWrite
) => {
    const axiosResponse = await instance.post(`/article`, param, config)
    return axiosResponse.data.data
}

export const getPostDetail = async (
    postId: number,
): Promise<PostDetail> => {
    const axiosResponse = await instance.get(`/article/${postId}`);
    return axiosResponse.data.data
};


export const editPost = async (
    postId: number,
    param: PostWrite
) => {
    const axiosResponse = await instance.put(`/article/${postId}`, param, config)
    return axiosResponse.data.data
}

export const deletePost = async (
    postId: number,
): Promise<PostDetail> => {
    const axiosResponse = await instance.delete(`/article/${postId}`, config);
    return axiosResponse.data.data
};


export const deleteComment = async (
    commentId: number
) => {
    const axiosResponse = await instance.delete(`/comment/${commentId}`, config);
    return axiosResponse.data.data
};

export const updateComment = async (
    commentId: number,
    param: CommentWrite
) => {
    const axiosResponse = await instance.put(`/comment/${commentId}`, param, config)
    return axiosResponse.data.data
}

export const writeComment = async (
    param: CommentWrite
) => {
    const axiosResponse = await instance.post(`/comment`, param, config)
    return axiosResponse.data.data
}

export const getCommentList = async (
    boardId: number
) => {
    const axiosResponse = await instance.get(`/comment/${boardId}`);
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
    const axiosResponse = await instance.get(`/article/list/${clubId}`, axiosParams);
    return axiosResponse.data.data
}

export const getClubList = async (
    params?: ClubSearch
) => {
    let axiosParams: AxiosRequestConfig | undefined;
    if (params) {
        axiosParams = {params};
    }
    const axiosResponse = await instance.get(`/usergroup/list`, axiosParams);
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
    const axiosResponse = await instance.get(`/usergroup/myClubList?userId=${userId}`, axiosParams);
    return axiosResponse.data.data
}


export const writeClub = async (
    param: ClubWrite
) => {
    const axiosResponse = await instance.post(`/club`, param, config)
    return axiosResponse.data.data
}

export const updateClub = async (
    clubId: number,
    param: ClubWrite
) => {
    console.log(`/club/${clubId}`)
    const axiosResponse = await instance.put(`/club/${clubId}`, param, config)
    return axiosResponse.data.data
}

export const deleteClub = async (
    clubId: number,
) => {
    const axiosResponse = await instance.delete(`/club/${clubId}`, config)
    return axiosResponse.data.data
}


export const getClubDetail = async (
    clubId: number
) => {
    const axiosResponse = await instance.get(`/usergroup/${clubId}`);
    return axiosResponse.data.data
}

export const getClubSummary = async (
    clubId: number,
) => {
    const axiosResponse = await instance.get(`/usergroup/summary/${clubId}`);
    return axiosResponse.data.data
}

export const joinClub = async (
    clubId: number,
    param: ClubJoin
) => {
    const axiosResponse = await instance.post(`/usergroup/${clubId}/join`, param, config)
    return axiosResponse.data.data
}

export const leaveClub = async (
    clubId: number,
    userId: number,
) => {
    const axiosResponse = await instance.delete(`/usergroup/${clubId}/members/${userId}`)
    return axiosResponse.data.data
}

export const getClubMemberList = async (
    clubId: number
) => {
    const axiosResponse = await instance.get(`/usergroup/${clubId}/members`)
    return axiosResponse.data.data
}

export const getClubMemberShip = async (
    clubId: number,
    userId: number
) => {

    const axiosResponse = await instance.get(`/usergroup/hasPermission/${clubId}/${userId}`)
    return axiosResponse.data.data
}
