'use client'

import {MessageCircleIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import CommunityInformCard from "@/components/components/board/communityCard";
import BoardList from "@/components/components/board/boardList";
import {useQueries} from "@tanstack/react-query";
import {getClubMemberShip, getClubSummary} from "@/lib/club";
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";
import BackBar from "@/components/layout/backbar";
import useUserState from "@/lib/login-state";

export default function CommunityPostPage({params}: { params: { id: number }; }) {
    const clubId = params.id;
    const {getUserInfo} = useUserState();
    const userId = getUserInfo().id;


    const results = useQueries({
        queries: [
            {
                queryKey: ['membership', clubId, userId],
                queryFn: () => getClubMemberShip(clubId, userId),
                staleTime: Infinity
            },
            {
                queryKey: ['club', clubId],
                queryFn: () => getClubSummary(clubId),
                staleTime: Infinity
            }
        ]
    });

    const isLoading = results.some((query) => query.isLoading);
    const hasError = results.some((query) => query.isError);
    const isSuccess = results.every((query) => query.isSuccess);

    const [memberShip, clubInfo] = results.map(result => result.data)

    if (isLoading)
        return (
            <Skeleton></Skeleton>
        )

    if (hasError) {
        return (
            <>
                Error
            </>
        )
    }

    return isSuccess && (
        <>
            <div className="pt-12"></div>
            <BackBar title={"커뮤니티 메인 페이지"}/>

            <CommunityInformCard clubId={clubInfo.info} clubName={clubInfo.clubName} createdDate={clubInfo.createdDate}
                                 memberType={memberShip.role} memberCount={clubInfo.memberCount}/>


            <BoardList/>

            <div className="mb-4"></div>

            <div className="sticky bottom-24 right-4 flex justify-end">
                <Button className="rounded-full h-16 w-16 text-white">
                    <MessageCircleIcon className="h-12 w-12"/>
                </Button>
            </div>
        </>
    );
}
