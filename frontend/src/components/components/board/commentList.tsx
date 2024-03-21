'use client'

import Comments from "@/components/components/comments";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Textarea} from "@/components/ui/textarea";
import {PlusIcon} from "lucide-react";
import React, {useState} from "react";
import {QueryClient, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getCommentList, updateComment, writeComment} from "@/lib/club";
import {toast} from "@/components/ui/use-toast";

interface CommentListProps {
    params: { id: number; boardId: number };
}

export default function CommentList(props: CommentListProps) {
    const {id, boardId} = props.params;

    const {isError : isFetchingError, isLoading , isSuccess : isFetchingSuccess, data: comments} = useQuery({
        queryKey: ['commentList', boardId],
        queryFn: () => getCommentList(boardId)
    })

    // const [comments, setComments] = useState<Comment[]>(comment || []); // 수정된 부분
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 상태와 설정 함수
    const queryClient = useQueryClient();


    const {isPending, isError, error, mutate, isSuccess} = useMutation({
        mutationFn: (param) => writeComment(param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "댓글을 정상적으로 저장하였습니다.",
            });

            queryClient.invalidateQueries({queryKey: ['commentList', boardId]})
            setNewComment('');
        },
        onError: (data, variables, context) => {
            toast({
                title: "에러가 발생하여 데이터를 저장할 수 없습니다.",
            });
        },
    })


    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            const newComments: CommentWrite = {
                userId: 1, // 임의의 사용자 이름
                content: newComment,
                boardId : boardId
            };

            mutate(newComments)
        }
    };


    if (isLoading) return <>Loading...</>;
    if (isFetchingError) return <>Error</>;

    return (
        <>
            {
                isFetchingSuccess && <>
                    <div>댓글: {comments.length}</div>
                    <div className="mb-24">
                        {comments.map((comment) => (
                            <Comments
                                key={comment.id}
                                comment={comment}
                                params={props.params}
                            />
                        ))}

                        <div className="flex items-center">
                            <Avatar>
                                <AvatarImage alt="User profile" src="/placeholder.svg?height=48&width=48"/>
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>

                            <div>사용자</div>
                        </div>

                        {/* 댓글 입력란 및 추가 버튼 */}
                        <div className="bg-white bottom-24 flex items-center justify-between">
                            <Textarea
                                className="flex-1"
                                placeholder="댓글을 입력하세요..."
                                value={newComment} // 입력된 내용 바인딩
                                onChange={(e) => setNewComment(e.target.value)} // 입력 변경 핸들러
                            />
                            <button onClick={handleAddComment}>
                                <PlusIcon className="text-gray-600 ml-3 relative right-1"/>
                            </button>
                        </div>
                    </div>
                </>
            }
        </>
    );
}
