interface Post {
    name: string;
    picture: string;
    title: string;
    commentCount: number;
    createdDate: string;
    articleId: number;
    category?: number;
}
interface Comment {
    name: string;
    createdDate: string;
    content: string;
    picture?: string | null | undefined;
    id : number
}

interface PostDetail {
    title: string;
    createdDate: string;
    content: string;
    name: string;
    picture: string | null;
    category: string;
    articleId : number;
    hit? : number | null;
    updatedDate : string;
    boardId : number
}


interface PostWrite {
    content: string; // contents의 타입에 따라서 적절한 타입으로 지정해야 합니다.
    title: string;
    boardId: number;
    userId: number;
}

interface CommentWrite {
    content : string,
    boardId: number;
    userId: number;
}

interface Title {
    title : string,
    createdDate : string
}

interface PostSearch {
    sortOrder?: string;
    keyword?: string;
    boardId?: number;
    articleId?: number;
}
