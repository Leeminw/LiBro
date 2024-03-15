import BoardItem from "@/components/components/board/boardItems";

interface BoardItemProps {
    userName: string;
    profileUrl: string;
    title: string;
    commentCount: number;
    created_date: string;
    id : number
}

interface BoardItemListProps {
    boardList: BoardItemProps[];
}

export default function BoardItemProvider (props : BoardItemListProps){

    const {boardList} = props
    return ( boardList.map(board => (
            <BoardItem key={board.id} userName={board.userName} profileUrl={board.profileUrl}
                       title={board.title} commentCount={board.commentCount} created_date={board.created_date}/>
        ))
    )
}
