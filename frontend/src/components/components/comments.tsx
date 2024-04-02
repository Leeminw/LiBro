'use client'

import React, {useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteComment, updateComment} from "@/lib/club";
import {toast} from "@/components/ui/use-toast";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontalIcon} from "lucide-react";
import {dateView} from "@/lib/dayjs";
import useUserState from "@/lib/login-state";

interface CommentProps {
    comment: Comment;
    params: { id: number; boardId: number };
}

export default function Comments(props: CommentProps) {
    const {picture, content, createdDate, name, id, writerId} = props.comment;
    const {id: clubId, boardId} = props.params;
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const {getUserInfo} = useUserState();
    const userId = getUserInfo().id;


    const deleteMutation = useMutation({
        mutationFn: (param: number) => deleteComment(param),
        onSuccess: () => {
            toast({
                title: "댓글을 정상적으로 삭제 하였습니다.",
            });
            queryClient.invalidateQueries({queryKey: ['commentList', boardId]});
        },
        onError: () => {
            toast({
                title: "에러가 발생하여 댓글을 삭제 할 수 없습니다.",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (param: CommentWrite) => updateComment(id, param),
        onSuccess: () => {
            toast({
                title: "댓글을 정상적으로 수정 하였습니다.",
            });
            setEditedContent('');
            queryClient.invalidateQueries({queryKey: ['commentList', boardId]});
        },
        onError: () => {
            toast({
                title: "에러가 발생하여 댓글을 수정 할 수 없습니다.",
            });
        },
    });

    const editHandler = () => {
        setIsEditing(true);
    };

    const cancelEditHandler = () => {
        setIsEditing(false);
        setEditedContent('');
    };

    const saveEditHandler = () => {
        const editedComment: CommentWrite = {
            content: editedContent,
            boardId: boardId,
            userId: userId
        }

        updateMutation.mutate(editedComment)
        setIsEditing(false);
        // 수정 내용 저장 후 추가 로직 작성


    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mx-auto my-2 border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="flex space-x-4">
                    <div>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={picture || "https://github.com/shadcn.png"} alt="@defaultUser"/>
                            <AvatarFallback>{name}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div className="text-lg font-bold dark:text-white">{name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-200">{dateView(createdDate)}</div>
                    </div>
                </div>
                <div>
                    {
                        (userId === writerId) ? isEditing ? (
                                <>
                                    <Button className="mr-2" onClick={cancelEditHandler}>취소</Button>
                                    <Button onClick={saveEditHandler}>저장</Button>
                                </>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="ml-auto w-8 h-8 rounded-full" size="icon" variant="ghost">
                                            <MoreHorizontalIcon className="w-4 h-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={editHandler}>수정</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => deleteMutation.mutate(id)}>삭제</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                            : null
                    }
                </div>
            </div>
            <div className="px-6 py-4">
                {isEditing ? (
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                ) : (
                    <div className="text-sm text-gray-800 pb-4 dark:text-gray-200">
                        {content}
                    </div>
                )}
            </div>
        </div>
    );
}
