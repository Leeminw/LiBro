import React from 'react';
import { Card, CardHeader, CardFooter} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function BoardItem (props : PostItem) {
    const { userName, title , created_date , commentCount, profileUrl, id} = props

    return (
        <div className="grid gap-4">
            <Card>
                <CardHeader className="p-2 flex flex-row items-center">
                        <a className="flex items-center gap-2 text-sm font-semibold">
                            <Avatar className="w-8 h-8 border">
                                <AvatarImage alt={userName} src={profileUrl}/>
                                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {userName}
                        </a>
                </CardHeader>
                <CardFooter className="p-2 pb-4 grid gap-2">
                    <div className="px-2 text-sm w-full grid gap-1.5">
                        <div>
                            {title}
                        </div>
                    </div>
                    <div className="px-2 text-sm w-full grid gap-1.5">
                        <div>
                            댓글 {commentCount}개
                        </div>
                    </div>
                    <div className="px-2 text-sm w-full grid gap-1.5">
                        <div>
                            {created_date}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

