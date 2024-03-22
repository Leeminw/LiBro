'use client'

import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Writter from "@/components/components/team-members";
import {ScrollArea} from "@/components/ui/scroll-area";
import CommentList from "@/components/components/board/commentList";
import {useParams} from 'next/navigation'
import {useQueries, useQuery} from "@tanstack/react-query";
import {getCategoryList, getCommentList, getPostDetail} from "@/lib/club";
import TitleCard from "@/components/components/board/titleCard";


// 예시용 게시글 정보
const examplePost: PostDetail = {
    title: "을왕리 독서 커뮤니티",
    createdDate: "2024-03-01",
    content: "여러분의 소중한 책 읽기 경험을 공유해주세요!",
    name: "제네시스",
    picture: null,
};

const exampleCommnets: Comment[] = [
]


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
