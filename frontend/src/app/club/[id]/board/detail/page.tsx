import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Writter from "@/components/components/team-members";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentList from "@/components/components/board/commentList";

// 예시용 게시글 정보
const examplePost : PostDetail = {
    title: "을왕리 독서 커뮤니티",
    date: "2024-03-01",
    content: "여러분의 소중한 책 읽기 경험을 공유해주세요!",
    nickName: "제네시스",
    profileUrl: null,
    comments: [
        {
            nickName: "김삿갓",
            registeredAt: "2024-01-01",
            contents: "반갑습니다.",
            profileUrl: null
        },
        {
            nickName: "김삿갓",
            registeredAt: "2024-01-01",
            contents: "반갑습니다.",
            profileUrl: null
        },
        {
            nickName: "김삿갓",
            registeredAt: "2024-01-01",
            contents: "반갑습니다.",
            profileUrl: null
        },
    ]
};

export default function CommunityPostPage() {
    const post = examplePost;

    return (
        <>
            {post && (
                <>
                    <Writter nickName={post.nickName} profileUrl={post.profileUrl}/>

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

                        <CommentList comments={post.comments} />
                    </ScrollArea>
                </>
            )}
        </>
    );
}
