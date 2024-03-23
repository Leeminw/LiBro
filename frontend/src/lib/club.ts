import axios, {AxiosRequestConfig} from "axios"

const mutationInstance = axios.create({
    headers: {
        "Content-Type": "application/json"
    }
})

const queryInstance = axios.create({})

export const getCategoryList = async (
    clubId: number,
): Promise<Category[]> => {
    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/board/list/${clubId}`);
    return axiosResponse.data.data
};

export const writeCategory = async (
    param: CategoryWrite
) => {
    const axiosResponse = await mutationInstance.post("http://localhost:8080/api/board", param);
    return axiosResponse.data.data
}

export const updateCategory = async (
    param: CategoryUpdate
) => {
    const axiosResponse = await mutationInstance.put("http://localhost:8080/api/board", param);
    return axiosResponse.data.data
}

export const deleteCategory = async (
    boardId: number
) => {
    const axiosResponse = await mutationInstance.delete(`http://localhost:8080/api/board/${boardId}`);
    return axiosResponse.data.data
}

export const writePost = async (
    param: PostWrite
) => {
    const axiosResponse = await mutationInstance.post(`http://localhost:8080/api/article`, param)
    return axiosResponse.data.data
}

export const getPostDetail = async (
    postId: number,
): Promise<PostDetail> => {
    console.log(`http://localhost:8080/api/article/${postId}`);
    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/article/${postId}`);
    return axiosResponse.data.data
};


export const editPost = async (
    postId: number,
    param: PostWrite
) => {
    console.log("요청 리퀘스트 : ", JSON.stringify(param));
    const axiosResponse = await mutationInstance.put(`http://localhost:8080/api/article/${postId}`, param)
    return axiosResponse.data.data
}

export const deletePost = async (
    postId: number,
): Promise<PostDetail> => {
    const axiosResponse = await mutationInstance.delete(`http://localhost:8080/api/article/${postId}`);
    return axiosResponse.data.data
};


export const deleteComment = async (
    commentId: number
) => {
    const axiosResponse = await mutationInstance.delete(`http://localhost:8080/api/comment/${commentId}`);
    return axiosResponse.data.data
};

export const updateComment = async (
    commentId: number,
    param: CommentWrite
) => {
    const axiosResponse = await mutationInstance.put(`http://localhost:8080/api/comment/${commentId}`, param)
    return axiosResponse.data.data
}

export const writeComment = async (
    param: CommentWrite
) => {
    const axiosResponse = await mutationInstance.post(`http://localhost:8080/api/comment`, param)
    return axiosResponse.data.data
}

export const getCommentList = async (
    boardId: number
) => {
    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/comment/${boardId}`);
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
    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/article/list/${clubId}`, axiosParams);
    return axiosResponse.data.data
}

export const getClubList = async (
    params?: ClubSearch
) => {
    let axiosParams: AxiosRequestConfig | undefined;
    if (params) {
        axiosParams = {params};
    }
    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/usergroup/list`, axiosParams);
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
    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/usergroup/myClubList?userId=${userId}`, axiosParams);
    return axiosResponse.data.data
}


export const writeClub = async (
    param: ClubWrite
) => {
    const axiosResponse = await mutationInstance.post(`http://localhost:8080/api/club`, param)
    return axiosResponse.data.data
}

export const updateClub = async (
    clubId: number,
    param: ClubWrite
) => {
    console.log(`http://localhost:8080/api/club/${clubId}`)
    const axiosResponse = await mutationInstance.put(`http://localhost:8080/api/club/${clubId}`, param)
    return axiosResponse.data.data
}

export const deleteClub = async (
    clubId: number,
) => {
    const axiosResponse = await mutationInstance.delete(`http://localhost:8080/api/club/${clubId}`)
    return axiosResponse.data.data
}


export const getClubDetail = async (
    clubId: number
) => {
    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/usergroup/${clubId}`);
    return axiosResponse.data.data
}

export const getClubSummary = async (
    clubId: number,
) => {
    const axiosResponse = await mutationInstance.get(`http://localhost:8080/api/usergroup/summary/${clubId}`);
    return axiosResponse.data.data
}

export const joinClub = async (
    clubId: number,
    param: ClubJoin
) => {
    const axiosResponse = await mutationInstance.post(`http://localhost:8080/api/usergroup/${clubId}/join`, param)
    return axiosResponse.data.data
}

export const leaveClub = async (
    clubId: number,
    userId: number,
) => {
    const axiosResponse = await mutationInstance.delete(`http://localhost:8080/api/usergroup/${clubId}/members/${userId}`)
    return axiosResponse.data.data
}

export const getClubMemberList = async (
    clubId: number
) => {
    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/usergroup/${clubId}/members`)
    return axiosResponse.data.data
}

export const getClubMemberShip = async (
    clubId: number,
    userId: number
) => {

    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/usergroup/hasPermission/${clubId}/${userId}`)
    return axiosResponse.data.data
}
