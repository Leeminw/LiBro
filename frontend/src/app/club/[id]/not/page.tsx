import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import {Card, CardContent,} from "@/components/ui/card";
import Writter from "@/components/components/team-members";
import Comments from "@/components/components/comments";
import {ScrollArea} from "@/components/ui/scroll-area";
import GroupOwner from "@/components/components/groupOwner";
import CommunityInformCard from "@/components/components/board/communityCard";
import {Button} from "@/components/ui/button";
import {MessageCircleIcon} from "lucide-react";

// 예시용 게시글 정보
const examplePost = {
    title: "을왕리 독서 커뮤니티",
    date: "2024-03-01",
    // content: "<p data-pm-slice='1 3 []'><strong>[개발 스터디 모집 내용 예시]</strong></p><ul><li><p>스터디 주제 :</p></li><li><p>스터디 목표 :</p></li><li><p>예상 스터디 일정(횟수) :</p></li><li><p>예상 커리큘럼 간략히 :</p></li><li><p>예상 모집인원 :</p></li><li><p>스터디 소개와 개설 이유 :</p></li><li><p>스터디 관련 주의사항 :</p></li><li><p>스터디에 지원할 수 있는 방법을 남겨주세요. (이메일, 카카오 오픈채팅방, 구글폼 등.) :</p></li></ul><p data-pm-slice='1 3 []'><strong>[개발 스터디 모집 내용 예시]</strong></p><ul><li><p>스터디 주제 :</p></li><li><p>스터디 목표 :</p></li><li><p>예상 스터디 일정(횟수) :</p></li><li><p>예상 커리큘럼 간략히 :</p></li><li><p>예상 모집인원 :</p></li><li><p>스터디 소개와 개설 이유 :</p></li><li><p>스터디 관련 주의사항 :</p></li><li><p>스터디에 지원할 수 있는 방법을 남겨주세요. (이메일, 카카오 오픈채팅방, 구글폼 등.) :</p></li></ul>",
    content: "<p data-pm-slice='1 3 []'><strong>[개발 스터디 모집 내용 예시]</strong></p><ul><li><p>스터디 주제 :</p></li><li><p>스터디 목표 :</p></li><li><p>예상 스터디 일정(횟수) :</p></li><li><p>예상 커리큘럼 간략히 :</p></li><li><p>예상 모집인원 :</p></li><li><p>스터디 소개와 개설 이유 :</p></li><li><p>스터디 관련 주의사항 :</p></li><li><p>스터디에 지원할 수 있는 방법을 남겨주세요. (이메일, 카카오 오픈채팅방, 구글폼 등.)",
    author: {
        nickName: "제네시스",
        profileUrl: null
    },
    comments: [

    ]
};

export default function CommunityPostPage() {
    const post = examplePost

    return (
        <>
            {post && (
                <>
                    <CommunityInformCard title={"을왕리"} date={"2024-12-12"} memberType={"MEMBER"} memberCount={3}/>
                    <GroupOwner nickName={post.author.nickName} profileUrl={post.author.profileUrl}/>
                    <ScrollArea
                        className="flex flex-col max-w-md mx-auto bg-white h-[calc(70vh-100px)] rounded-lg border">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify(new JSDOM('<!DOCTYPE html>').window).sanitize(post.content),
                            }}
                            style={{
                                marginTop: '10px',
                                whiteSpace: 'pre-wrap',
                            }}

                            className="mx-3"
                        />
                    </ScrollArea>

                    <div className="mb-4"></div>

                    <div className="sticky bottom-24 right-4 flex justify-end">
                        <Button
                            className="bg-[#9268EB] text-white px-6 py-2 rounded w-full"
                            onClick={undefined}
                        >
                            가입하기
                        </Button>
                    </div>


                </>
            )}
        </>
    );
}
