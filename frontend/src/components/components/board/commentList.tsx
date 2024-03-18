'use client'

import Comments from "@/components/components/comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

interface CommentListProps {
    comments: Comment[];
}

export default function CommentList(props: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>(props.comments); // 수정된 부분
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 상태와 설정 함수

    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            const newComments : Comment = {
                nickName: "사용자", // 임의의 사용자 이름
                registeredAt: new Date().toISOString(), // 현재 시간으로 설정
                contents: newComment,
                profileUrl: null,
            };
            const updatedComments : Comment[] = [
                ...comments,
                newComments,
            ];

            // 댓글 추가 후 입력란 초기화
            setNewComment("");
            setComments(updatedComments); // 수정된 부분
        }
    };

    return (
        <>
            <div>댓글: {comments.length}</div> {/* 수정된 부분 */}
            <div className="mb-24">
                {comments.map((comment, index) => (
                    <Comments
                        key={index}
                        profileUrl={comment.profileUrl}
                        nickName={comment.nickName}
                        registeredAt={comment.registeredAt}
                        contents={comment.contents}
                    />
                ))}

                <div className="flex items-center">
                    <Avatar>
                        <AvatarImage alt="User profile" src="/placeholder.svg?height=48&width=48" />
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
                        <PlusIcon className="text-gray-600 ml-3 relative right-1" />
                    </button>
                </div>
            </div>
        </>
    );
}
