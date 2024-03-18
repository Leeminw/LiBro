interface Post {
    userName: string;
    profileUrl: string;
    title: string;
    commentCount: number;
    created_date: string;
    id: number;
}
interface Comment {
    nickName: string;
    registeredAt: string;
    contents: string;
    profileUrl: string | null;
}

interface PostDetail {
    title: string;
    date: string;
    content: string;
    nickName: string;
    profileUrl: string | null;
    comments: Array<Comment>;
}
