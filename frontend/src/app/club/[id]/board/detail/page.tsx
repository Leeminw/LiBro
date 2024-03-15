import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import {Card, CardContent,} from "@/components/ui/card";
import Writter from "@/components/components/team-members";
import Comments from "@/components/components/comments";
import {ScrollArea} from "@/components/ui/scroll-area";

// 예시용 게시글 정보
const examplePost = {
    title: "을왕리 독서 커뮤니티",
    date: "2024-03-01",
    content: "",
    author: {
        nickName: "제네시스",
        profileUrl: null
    },
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
    const post = examplePost

    return (
        <>
            {post && (
                <>
                    <Writter nickName={post.author.nickName} profileUrl={post.author.profileUrl}/>

                    <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(90vh-120px)]">
                        <Card>
                            <CardContent>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify(new JSDOM('<!DOCTYPE html>').window).sanitize(post.content),
                                    }}
                                    style={{
                                        marginTop: '10px',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                    className="bg-white min-h-[100px]"
                                />
                            </CardContent>
                        </Card>

                        <div>
                            {`댓글: ${post.comments.length}`}
                        </div>
                        <div className="mb-24">
                            {post.comments.map((comment, index) => (
                                <Comments key={index} profileUrl={comment.profileUrl} nickName={comment.nickName}
                                          registeredAt={comment.registeredAt} contents={comment.contents}/>
                            ))}
                        </div>
                    </ScrollArea>
                </>
            )}
        </>
    );
}
