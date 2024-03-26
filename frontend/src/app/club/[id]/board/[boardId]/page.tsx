'use client'

import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Writter from "@/components/components/team-members";
import {ScrollArea} from "@/components/ui/scroll-area";
import CommentList from "@/components/components/board/commentList";
import {useQuery} from "@tanstack/react-query";
import {getPostDetail} from "@/lib/club";
import TitleCard from "@/components/components/board/titleCard";
import BackBar from "@/components/layout/backbar";

export default function CommunityPostPage({params}: { params: { id: number; boardId: number }; }) {

    const {id : clubId, boardId } = params

    const { isLoading, isFetching, data : post , isError : isFetchingError, error : FetchingError, refetch, isSuccess  } = useQuery({
        queryKey: ['boardDetail', boardId],
        queryFn: () => getPostDetail(boardId)
    });

    // const results = useQueries({
    //     queries: [
    //         {
    //             queryKey: ['boardDetail', boardId],
    //             queryFn: () => getPostDetail(boardId)
    //         },
    //
    //         {
    //             queryKey: ['commentList', boardId],
    //             queryFn: () => getCommentList(boardId)
    //         }
    //     ]
    // });
    //
    // const isLoading = results.some((query) => query.isLoading);
    // const hasError = results.some((query) => query.isError);
    // const isSuccess = results.every((query) => query.isSuccess);
    //
    //
    // if (isLoading) return <>Loading...</>;
    // if (hasError) return <>Error</>;
    //
    // const [post, comments ] = results.map(result => result.data)


    return (
        <>
            {isSuccess && (
                <>
                    <BackBar title={"글 조회하기"}/>
                    <TitleCard title={post.title} createdDate={post.createdDate}/>

                    <Writter nickName={post.name} profileUrl={post.picture} boardId={boardId} groupId={clubId}/>

                    <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(90vh-120px)]">
                        <Card>
                            <CardContent>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: post.content
                                    }}
                                    style={{
                                        marginTop: '10px',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                    className="bg-white min-h-[100px]"
                                />
                            </CardContent>
                        </Card>

                        <CommentList params={params}/>
                    </ScrollArea>
                </>
            )}
        </>
    );
}
