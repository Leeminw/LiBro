"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import GroupOwner from "@/components/components/groupOwner";
import CommunityInformCard from "@/components/components/board/communityCard";
import { Button } from "@/components/ui/button";
import React from "react";
import SubHeader from "@/components/SubHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClubDetail, joinClub } from "@/lib/club";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import useUserState from "@/lib/login-state";
import { Spinner } from "@/components/ui/spinner";

export default function CommunityPostPage({
  params,
}: {
  params: { id: number };
}) {
  const clubId = params.id;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { getUserInfo } = useUserState();
  const userId = getUserInfo().id;
  const isMember = userId !== 0;

  const {
    isLoading,
    isSuccess: isFetchingSuccess,
    isError: isFetchingError,
    data: club,
  } = useQuery({
    queryFn: () => getClubDetail(clubId),
    queryKey: ["clubDetail", clubId],
  });

  const { isPending, isError, error, mutate, isSuccess } = useMutation({
    mutationFn: () => joinClub(clubId, { userId: userId }),
    onSuccess: (data, variables, context) => {
      toast({
        title: "클럽에 정상적으로 가입되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["myclubList"] });
      queryClient.invalidateQueries({
        queryKey: ["memberShip", clubId, userId],
      });
      router.refresh();
    },
    onError: (data, variables, context) => {
      toast({
        title: "에러가 발생하여 클럽에 가입 할 수 없습니다.",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isPending) return <Spinner>Loading...</Spinner>;

  if (isFetchingError) {
    return <div>Error...</div>;
  }

  return (
    isFetchingSuccess && (
      <>
        <SubHeader title="커뮤니티 가입하기" backArrow={true} />
        <div className="pt-16 px-2">
          <CommunityInformCard
            clubId={club.clubId}
            clubName={club.clubName}
            createdDate={club.createdDate}
            memberType={"NONE"}
            memberCount={club.memberCount}
          />
          <div className="flex">
            <GroupOwner nickName={club.clubOwnerName} profileUrl={club.profile}>
              {isMember ? (
                <Button
                  className="bg-[#9268EB] text-white px-6 py-2 rounded w-1/3 h-full"
                  onClick={() => mutate()}
                >
                  가입하기
                </Button>
              ) : (
                <Button className="bg-gray-400 text-white px-6 py-2 rounded w-1/3 h-full">
                  가입하기
                </Button>
              )}
            </GroupOwner>
          </div>
          <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-fit rounded-lg border min-h-32 px-6">
            <div className="font-semibold text-xl pt-4">소개</div>
            <div
              dangerouslySetInnerHTML={{
                __html: club.description,
              }}
              style={{
                marginTop: "10px",
                whiteSpace: "pre-wrap",
              }}
              className="pb-4"
            />
          </ScrollArea>
          <div className="pb-20" />
        </div>
      </>
    )
  );
}
