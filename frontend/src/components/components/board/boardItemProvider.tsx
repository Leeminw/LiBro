import BoardItem from "@/components/components/board/boardItems";

interface BoardItemListProps {
    boardList: Post[];
}

export default function BoardItemProvider (props : BoardItemListProps){

    const {boardList} = props
    return ( boardList.map(board => (
            <BoardItem key={board.articleId} articleId={board.articleId} userName={board.userName} profileUrl={board.profileUrl}
                       title={board.title} commentCount={board.commentCount} created_date={board.created_date}/>
        ))
    )
}
