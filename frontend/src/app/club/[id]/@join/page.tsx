'use client'

import {ScrollArea} from "@/components/ui/scroll-area";
import GroupOwner from "@/components/components/groupOwner";
import CommunityInformCard from "@/components/components/board/communityCard";
import {Button} from "@/components/ui/button";
import React from "react";
import SubHeader from "@/components/SubHeader";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getClubDetail, joinClub} from "@/lib/club";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";

export default function CommunityPostPage({params}: { params: { id: number } }) {
    const clubId = params.id;
    const queryClient = useQueryClient();
    const router = useRouter();

    const {isLoading, isSuccess: isFetchingSuccess, isError: isFetchingError, data: club} = useQuery({
        queryFn: () => getClubDetail(clubId),
        queryKey: ['clubDetail', clubId]
    });

    const {isPending, isError, error, mutate, isSuccess} = useMutation({
        mutationFn: () => joinClub(clubId, {userId: 1}),
        onSuccess: (data, variables, context) => {
            toast({
                title: "클럽에 정상적으로 가입되었습니다.",
            });
            queryClient.invalidateQueries(['myclubList']);
            router.refresh();


        },
        onError: (data, variables, context) => {
            toast({
                title: "에러가 발생하여 클럽에 가입 할 수 없습니다.",
            });
        },
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isFetchingError) {
        return <div>Error...</div>;
    }

    return isFetchingSuccess && (
        <>
            <SubHeader title="커뮤니티 가입하기" backArrow={true}/>
            <div className="pt-24"/>
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
            <div className="sticky bottom-24 right-4 flex justify-end">
                <Button
                    className="bg-[#9268EB] text-white px-6 py-2 rounded w-full"
                    onClick={() => mutate()}
                >
                    가입하기
                </Button>
            </div>
        </>
    );
}
