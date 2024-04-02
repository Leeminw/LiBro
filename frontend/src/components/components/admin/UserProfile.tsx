'use client'

import React from 'react';
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {BanIcon} from "lucide-react"
import {toast} from "@/components/ui/use-toast";
import {dateFormat} from "@/lib/dayjs";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {leaveClub} from "@/lib/club";
import {useParams} from "next/navigation";


const UserProfile: React.FC<UserProfile> = (props) => {
    const {profile, userId, name, createdDate, role} = props;

    const params = useParams();
    const clubId = parseInt(params.id as string);
    const queryClient = useQueryClient();

    const handleBanUser = (userId: number, e: React.MouseEvent<HTMLButtonElement>) => {
        deleteMutation.mutateAsync();
        toast({
            title: "삭제되었습니다. ",
            description: `유저명 ${name}`,
        })
    };

    const deleteMutation = useMutation({
        // 변경시 사용할 네트워크 요청코드 입니다.
        mutationFn: (param) => leaveClub(clubId, userId),
        onSuccess: (data, variables, context) => {
            toast({
                title: "해당 유저를 정상적으로 탈퇴 시켰습니다.",
            });

            queryClient.invalidateQueries({queryKey: ['memberList', clubId]})
        },

        onError: (data, variables, context) => {
            toast({
                title: "에러가 발생하여 해당 유저를 탈퇴 시킬 수 없습니다.",
            });
        }
    });

    return (
        <div className="flex items-center p-4 border border-gray-200 m-2 rounded-md">
            <Avatar>
                <AvatarImage alt="User profile" src={profile}/>
                <AvatarFallback>{name}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
                <span className="font-semibold">{name}</span>
                <span className="block text-sm text-gray-500">{dateFormat(createdDate)}</span>
            </div>

            {role === 'CLUB_USER' && (
                <Button className="ml-auto" variant="ghost" onClick={(e) => {
                    handleBanUser(userId, e)
                }}>
                    <BanIcon className="w-6 h-6"/>
                </Button>
            )}
        </div>
    );
};

export default UserProfile;
