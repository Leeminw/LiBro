'use client'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarIcon, MoreHorizontalIcon, SettingsIcon, UsersIcon, XIcon} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {dateFormat} from "@/lib/dayjs";
import {useParams, useRouter} from "next/navigation";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "@/components/ui/use-toast";
import {leaveClub} from "@/lib/club";
import Link from "next/link";
import React from "react";
import useUserState from "@/lib/login-state";


export default function CommunityInformCard(props: ClubInform) {
    const {clubName, createdDate, memberType, memberCount} = props
    const router = useRouter();
    const params = useParams();
    const clubId = parseInt(params.id);
    const queryClient = useQueryClient();
    const { getUserInfo } = useUserState();
    const userId = getUserInfo().id;


    const {isPending, isError, error, mutate} = useMutation({
        // 변경시 사용할 네트워크 요청코드 입니다.
        mutationFn: () => leaveClub(clubId, userId),

        onSuccess: (data, variables, context) => {
            toast({
                title: "성공적으로 탈퇴 하였습니다.",
            });
            queryClient.invalidateQueries(['membership', clubId, userId])
            router.push(`/club`);
        },

        onError: (data, variables, context) => {
            toast({
                title: "에러가 발생하여 탈퇴를 할 수 없습니다.",
            });
        },
    })


    const communityManageHandler = () => {
        router.push(`/club/${clubId}/edit`)
    };

    const boardManageHandler = () => {
        router.push(`/club/${clubId}/admin/category`)
    };

    const memberManageHandler = () => {
        router.push(`/club/${clubId}/admin/member`)
    };

    const leaveClubHandler = () => {
        mutate();
    };

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 justify-between">
                    <Link href={`/club/${clubId}/inform`}>
                        {clubName}
                    </Link>
                    {(memberType === 'CLUB_ADMIN' || memberType === 'CLUB_USER') && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="ml-auto w-8 h-8 rounded-full" size="icon" variant="ghost">
                                    <MoreHorizontalIcon className="w-4 h-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {memberType === 'CLUB_ADMIN' && (
                                    <>
                                        <DropdownMenuItem onClick={communityManageHandler}>
                                            <SettingsIcon className="w-4 h-4 mr-2"/>
                                            커뮤니티 관리
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={boardManageHandler}>
                                            <SettingsIcon className="w-4 h-4 mr-2"/>
                                            게시판 관리
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={memberManageHandler}>
                                            <SettingsIcon className="w-4 h-4 mr-2"/>
                                            회원관리
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {memberType === 'CLUB_USER' && (
                                    <>
                                        <DropdownMenuItem onClick={leaveClubHandler}>
                                            <XIcon className="w-4 h-4 mr-2"/>
                                            탈퇴하기
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent >
                <div className="flex items-center align-top">
                    <div className="flex items-center gap-2 justify-between">
                        <CalendarIcon className="w-5 h-5"/>
                        <div className="font-bold">{dateFormat(createdDate)}</div>
                    </div>
                </div>
                <div className="flex items-center align-top">
                    <div className="flex items-center gap-2 justify-between">
                        <UsersIcon className="w-5 h-5"/>
                        <div className="font-bold">{memberCount}</div>
                    </div>
                </div>


            </CardContent>

        </Card>
    );
}
