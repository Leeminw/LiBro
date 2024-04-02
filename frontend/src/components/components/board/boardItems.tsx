import React from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { dateView } from "@/lib/dayjs";

export default function BoardItem(props: Post) {
  const { name, title, createdDate, commentCount, picture, articleId } = props;

  const params = useParams();

  return (
    <div className="grid gap-4">
      <Link
        className="font-bold relative"
        href={`/club/${params.id}/board/${articleId}`}
      >
        <div className="absolute w-full h-full hover:bg-white/60 transition-colors duration-300"></div>
        <Card>
          <CardHeader className="p-2 flex flex-row items-center">
            <div className="flex items-center w-full text-sm font-semibold">
              <Avatar className="w-8 h-8 border ml-2">
                <AvatarImage alt={name} src={picture} />
                <AvatarFallback>{name}</AvatarFallback>
              </Avatar>
              <div className="w-full pl-4">{name}</div>
              <div className="px-4 text-xs w-fit grid gap-1.5 font-normal text-gray-400">
                <div className="w-fit text-nowrap">{dateView(createdDate)}</div>
              </div>
            </div>
          </CardHeader>
          <CardFooter className="p-2 pb-4 grid gap-2">
            <div className="">
              <div className="px-2 pb-4 text-sm w-full font-normal">
                {title}
              </div>
            </div>
            <div className="px-2 text-xs w-full grid gap-1.5 font-semibold">
              <div>댓글 {commentCount}개</div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
