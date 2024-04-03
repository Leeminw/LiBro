"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Writter from "@/components/components/team-members";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentList from "@/components/components/board/commentList";
import { useQuery } from "@tanstack/react-query";
import { getPostDetail } from "@/lib/club";
import TitleCard from "@/components/components/board/titleCard";
import BackBar from "@/components/layout/backbar";
import SubHeader from "@/components/SubHeader";

export default function CommunityPostPage({
  params,
}: {
  params: { id: number; boardId: number };
}) {
  const { id: clubId, boardId } = params;

  const {
    isLoading,
    isFetching,
    data: post,
    isError: isFetchingError,
    error: FetchingError,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["boardDetail", boardId],
    queryFn: () => getPostDetail(boardId),
  });

  return (
    <>
      {isSuccess && (
        <>
          <SubHeader
            title="글 조회하기"
            backArrow={true}
            src={`/club/${clubId}`}
          />
          <div className="pt-16"></div>
          <TitleCard title={post.title} createdDate={post.createdDate} />

          <Writter
            nickName={post.name}
            profileUrl={post.picture}
            boardId={boardId}
            groupId={clubId}
            writerId={post.writerId}
          />

          <ScrollArea className="flex flex-col max-w-md min-h-[50vh] h-fit mx-2">
            <Card>
              <CardContent className="px-6">
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                  style={{
                    marginTop: "10px",
                    whiteSpace: "pre-wrap",
                  }}
                  className="bg-white min-h-[100px] pt-2 px-0"
                />
              </CardContent>
            </Card>
            <CommentList params={params} />
          </ScrollArea>
        </>
      )}
    </>
  );
}
