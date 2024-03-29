import {AxiosRequestConfig} from "axios"
import instance from '@/lib/interceptor'

const config = {
    headers: {
        'Content-Type': 'application/json',
    }
};

// const instance = axios.create({
//     baseURL: baseURL,
// })


export const getCategoryList = async (
    clubId: number,
): Promise<Category[]> => {
    const axiosResponse = await instance.get(`/api/board/list/${clubId}`);
    return axiosResponse.data.data
};

export const writeCategory = async (
    param: CategoryWrite
) => {
    const axiosResponse = await instance.post("/api/board", param, config);
    return axiosResponse.data.data
}

export const updateCategory = async (
    param: CategoryUpdate
) => {
    const axiosResponse = await instance.put("/api/board", param, config);
    return axiosResponse.data.data
}

export const deleteCategory = async (
    boardId: number
) => {
    const axiosResponse = await instance.delete(`/api/board/${boardId}`, config);
    return axiosResponse.data.data
}

export const writePost = async (
    param: PostWrite
) => {
    const axiosResponse = await instance.post(`/api/article`, param, config)
    return axiosResponse.data.data
}

export const getPostDetail = async (
    postId: number,
): Promise<PostDetail> => {
    const axiosResponse = await instance.get(`/api/article/${postId}`);
    return axiosResponse.data.data
};


export const editPost = async (
    postId: number,
    param: PostWrite
) => {
    const axiosResponse = await instance.put(`/api/article/${postId}`, param, config)
    return axiosResponse.data.data
}

export const deletePost = async (
    postId: number,
): Promise<PostDetail> => {
    const axiosResponse = await instance.delete(`/api/article/${postId}`, config);
    return axiosResponse.data.data
};


export const deleteComment = async (
    commentId: number
) => {
    const axiosResponse = await instance.delete(`/api/comment/${commentId}`, config);
    return axiosResponse.data.data
};

export const updateComment = async (
    commentId: number,
    param: CommentWrite
) => {
    const axiosResponse = await instance.put(`/api/comment/${commentId}`, param, config)
    return axiosResponse.data.data
}

export const writeComment = async (
    param: CommentWrite
) => {
    const axiosResponse = await instance.post(`/api/comment`, param, config)
    return axiosResponse.data.data
}

export const getCommentList = async (
    boardId: number
) => {
    const axiosResponse = await instance.get(`/api/comment/${boardId}`);
    return axiosResponse.data.data
}

export const getPostList = async (
    clubId: number | null,
    params?: PostSearch
) => {
    let axiosParams: AxiosRequestConfig | undefined;
    if (params) {
        axiosParams = {params};
    }
    const axiosResponse = await instance.get(`/api/article/list/${clubId}`, axiosParams);
    return axiosResponse.data.data
}

export const getClubList = async (
    params?: ClubSearch
) => {
    let axiosParams: AxiosRequestConfig | undefined;
    if (params) {
        axiosParams = {params};
    }
    const axiosResponse = await instance.get(`/api/usergroup/list`, axiosParams);
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
    const axiosResponse = await instance.get(`/api/usergroup/myClubList?userId=${userId}`, axiosParams);
    return axiosResponse.data.data
}


export const writeClub = async (
    param: ClubWrite
) => {
    const axiosResponse = await instance.post(`/api/club`, param, config)
    return axiosResponse.data.data
}

export const updateClub = async (
    clubId: number,
    param: ClubWrite
) => {
    console.log(`/api/club/${clubId}`)
    const axiosResponse = await instance.put(`/api/club/${clubId}`, param, config)
    return axiosResponse.data.data
}

export const deleteClub = async (
    clubId: number,
) => {
    const axiosResponse = await instance.delete(`/api/club/${clubId}`, config)
    return axiosResponse.data.data
}


export const getClubDetail = async (
    clubId: number
) => {
    const axiosResponse = await instance.get(`/api/usergroup/${clubId}`);
    return axiosResponse.data.data
}

export const getClubSummary = async (
    clubId: number,
) => {
    const axiosResponse = await instance.get(`/api/usergroup/summary/${clubId}`);
    return axiosResponse.data.data
}

export const joinClub = async (
    clubId: number,
    param: ClubJoin
) => {
    const axiosResponse = await instance.post(`/api/usergroup/${clubId}/join`, param, config)
    return axiosResponse.data.data
}

export const leaveClub = async (
    clubId: number,
    userId: number,
) => {
    const axiosResponse = await instance.delete(`/api/usergroup/${clubId}/members/${userId}`)
    return axiosResponse.data.data
}

export const getClubMemberList = async (
    clubId: number
) => {
    const axiosResponse = await instance.get(`/api/usergroup/${clubId}/members`)
    return axiosResponse.data.data
}

export const getClubMemberShip = async (
    clubId: number,
    userId: number
) => {

    const axiosResponse = await instance.get(`/api/usergroup/hasPermission/${clubId}/${userId}`)
    return axiosResponse.data.data
}


