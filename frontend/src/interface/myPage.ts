interface UserDetail {
    authType: string,
    email: string,
    name: string,
    profile: string,
    nickName: string,
    id: number,
}

interface BookDetailResponse {
    id: number;
    isbn: string;
    title: string;
    summary: string;
    price: number;
    rating: number;
    ratingCount: number;
    author: string;
    translator: string;
    publisher: string;
    pubDate: string;
    thumbnail: string;
    shortsUrl: string;
    createdDate: string;
    updatedDate: string;
}

interface UserBookListResponse {
    userBookId: number;
    type: string;
    bookDetailResponseDto: BookDetailResponse;
    createdTime: string;
    updatedTime: string;
    rating: number;
    isComplete: boolean;
    isDeleted: boolean;
    ratingComment: string;
    ratingSpoiler: boolean;
}
