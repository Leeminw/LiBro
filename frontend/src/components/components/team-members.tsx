'use client'

import React from "react";
import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontalIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {QueryClient, useMutation} from "@tanstack/react-query";
import {deletePost} from "@/lib/club";
import {toast} from "@/components/ui/use-toast";
import useUserState from "@/lib/login-state";

interface GroupOwner {
    profileUrl: string | null,
    nickName: string,
    boardId?: number | null
    groupId?: number | null
    writerId? : number | null
}

export default function Writer(props: GroupOwner) {
    const {profileUrl, nickName, boardId, groupId, writerId} = props;

    const router = useRouter();

    const queryClient = new QueryClient();

    const { getUserInfo } = useUserState();
    const userId = getUserInfo().id;

    console.log(userId, writerId);

    const {isPending, isError, error, mutate, data} = useMutation({
        mutationFn: (param: number) => deletePost(param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "데이터를 정상적으로 삭제 하였습니다.",
            });
            queryClient.invalidateQueries({queryKey: ['articleList']});
            router.push(`/club/${groupId}`);
        },
        onError: (data, variables, context) => {
            toast({
                title: "에러가 발생하여 데이터를 삭제 할 수 없습니다.",
            });
        },
    })

    const handleEditClick = () => {
        router.push(`/club/${groupId}/board/${boardId}/edit`);
    };

    const handleDeleteClick = () => {
        mutate(boardId as number)
    };

    return (
        <div className="flex items-center h-3/4 bg-white justify-between p-2 border rounded-md">
            <div className="flex items-center space-x-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={profileUrl || "https://github.com/shadcn.png"} alt="@defaultUser" />
                    <AvatarFallback>{nickName}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{nickName}</span>
            </div>
            {
                (userId == writerId) && (<DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="ml-auto w-8 h-8 rounded-full" size="icon" variant="ghost">
                            <MoreHorizontalIcon className="w-4 h-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleEditClick}>
                            수정
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDeleteClick}>
                            삭제
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>)
            }

        </div>
    );
}
