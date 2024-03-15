import BoardItem from "@/components/components/board/boardItems";

interface BoardItemListProps {
    boardList: PostItem[];
}

export default function BoardItemProvider (props : BoardItemListProps){

    const {boardList} = props
    return ( boardList.map(board => (
            <BoardItem key={board.id} id={board.id}  userName={board.userName} profileUrl={board.profileUrl}
                       title={board.title} commentCount={board.commentCount} created_date={board.created_date}/>
        ))
    )
}
