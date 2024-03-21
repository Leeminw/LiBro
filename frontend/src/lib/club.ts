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
        axiosParams = { params };
    }
    const axiosResponse = await queryInstance.get(`http://localhost:8080/api/article/list/${clubId}`, axiosParams);
    return axiosResponse.data.data
}
