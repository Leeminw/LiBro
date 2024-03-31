import React from 'react';
import {Card, CardFooter, CardHeader} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import Link from "next/link";
import {useParams} from "next/navigation";
import {dateView} from "@/lib/dayjs";

export default function BoardItem (props : Post) {
    const { name, title , createdDate , commentCount, picture, articleId} = props

    const params = useParams();

    return (
        <div className="grid gap-4">
            <Card>
                <CardHeader className="p-2 flex flex-row items-center">
                        <a className="flex items-center gap-2 text-sm font-semibold">
                            <Avatar className="w-8 h-8 border">
                                <AvatarImage alt={name} src={picture}/>
                                <AvatarFallback>{name}</AvatarFallback>
                            </Avatar>
                            {name}
                        </a>
                </CardHeader>
                <CardFooter className="p-2 pb-4 grid gap-2">
                    <div className="px-2 text-sm w-full grid gap-1.5">
                        <Link className="font-bold" href={`/club/${params.id}/board/${articleId}`}>
                            {title}
                        </Link>
                    </div>
                    <div className="px-2 text-sm w-full grid gap-1.5">
                        <div>
                            댓글 {commentCount}개
                        </div>
                    </div>
                    <div className="px-2 text-sm w-full grid gap-1.5">
                        <div>
                            {dateView(createdDate)}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

