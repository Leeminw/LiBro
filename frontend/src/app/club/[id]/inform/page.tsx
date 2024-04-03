'use client'

import {ScrollArea} from "@/components/ui/scroll-area";
import GroupOwner from "@/components/components/groupOwner";
import CommunityInformCard from "@/components/components/board/communityCard";
import React from "react";
import SubHeader from "@/components/SubHeader";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getClubDetail} from "@/lib/club";
import {useRouter} from "next/navigation";

export default function CommunityPostPage({params}: { params: { id: number } }) {
    const clubId = params.id;
    const queryClient = useQueryClient();
    const router = useRouter();

    const {isLoading, isSuccess: isFetchingSuccess, isError: isFetchingError, data: club} = useQuery({
        queryFn: () => getClubDetail(clubId),
        queryKey: ['clubDetail', clubId]
    });


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isFetchingError) {
        return <div>Error...</div>;
    }

    return isFetchingSuccess && (
        <>
            <SubHeader title="커뮤니티 정보 보기" backArrow={true}/>
            <div className="pt-16"/>
            <CommunityInformCard clubId={club.clubId} clubName={club.clubName} createdDate={club.createdDate}
                                 memberType={"NONE"} memberCount={club.memberCount}/>
            <GroupOwner nickName={club.clubOwnerName} profileUrl={club.profile}/>
            <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(70vh-100px)] rounded-lg border">
                <div
                    dangerouslySetInnerHTML={{
                        __html: club.description,
                    }}
                    style={{
                        marginTop: '10px',
                        whiteSpace: 'pre-wrap',
                    }}
                    className="mx-3"
                />
            </ScrollArea>
        </>
    );
}
