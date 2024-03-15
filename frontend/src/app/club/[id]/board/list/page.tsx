'use client'

import {useState, useEffect, SetStateAction} from 'react';
import {
    Search,
    MessageCircleIcon,
} from "lucide-react";
import {Input} from "@/components/ui/input";
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {CardHeader, CardContent, CardFooter, Card, CardTitle} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import BoardItem from "@/components/components/board/boardItems";
import CommunityInformCard from "@/components/components/board/communityCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import BoardItemProvider from "@/components/components/board/BoardItemProvider";

interface BoardItemProps {
    userName: string;
    profileUrl: string;
    title: string;
    commentCount: number;
    created_date: string;
    id : number
}


const dummyData = [
    {
        userName: "김개똥",
        profileUrl: "https://randomuser.me/api/portraits/women/48.jpg",
        title: "몰라몰라",
        commentCount: 20,
        created_date: "2024-12-12",
        id : 1
    },
    {
        userName: "김개똥",
        profileUrl: "https://randomuser.me/api/portraits/women/48.jpg",
        title: "몰라몰라",
        commentCount: 20,
        created_date: "2024-12-12",
        id : 1
    },
    {
        userName: "김개똥",
        profileUrl: "https://randomuser.me/api/portraits/women/48.jpg",
        title: "몰라몰라",
        commentCount: 20,
        created_date: "2024-12-12",
        id : 3
    },
    {
        userName: "김개똥",
        profileUrl: "https://randomuser.me/api/portraits/women/48.jpg",
        title: "몰라몰라",
        commentCount: 20,
        created_date: "2024-12-12",
        id : 4
    }
];



export default function CommunityPostPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // const handleSearchChange = (event) => {
    //     console.log(event.target.value)
    //     setSearchTerm(event.target.value);
    // };


    return (
        <>
            <CommunityInformCard title={"을왕리"} date={"2024-12-12"} memberType={"MEMBER"} memberCount={3}/>

            <div className="flex justify-between">
                <Button className=" ">글쓰기</Button>
                <div className="w-2/3">
                    <div className="relative ">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Search" className="pl-8"/>
                    </div>
                </div>
            </div>

            <Card className="">
                <CardHeader className="p-3 border-b">
                    <div className="flex items-center justify-between">
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="정렬기준"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="apple">최신</SelectItem>
                                    <SelectItem value="banana">가장 오래된</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="게시판"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(90vh-120px)]">
                    <CardContent className="p-0">
                        <BoardItemProvider boardList={dummyData}/>
                    </CardContent>
                </ScrollArea>
            </Card>

            <div className="mb-4"></div>

            <div className="sticky bottom-24 right-4 flex justify-end">
                <Button className="rounded-full h-16 w-16 text-white">
                    <MessageCircleIcon className="h-12 w-12"/>
                </Button>
            </div>
        </>
    );

}
