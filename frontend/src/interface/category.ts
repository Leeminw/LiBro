interface Category {
    id: number;
    name: string;
}

interface CategoryWrite {
    clubId: number,
    name: string
}

interface CategoryUpdate {
    clubId: number,
    boardId: number,
    name: string,
}
