'use client'

import { useState } from 'react';
import { Search, MessageCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, CardFooter, Card, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BoardItem from "@/components/components/board/boardItems";
import CommunityInformCard from "@/components/components/board/communityCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import BoardItemProvider from "@/components/components/board/boardItemProvider";
import boardList from "@/components/components/board/boardList";
import BoardList from "@/components/components/board/boardList";

const dummyData = [
    {
        userName: "김개똥",
        profileUrl: "https://randomuser.me/api/portraits/women/48.jpg",
        title: "몰라몰라",
        commentCount: 20,
        created_date: "2024-12-12",
        id: 1,
        category : "공지 게시판"
    },
    {
        userName: "김개똥",
        profileUrl: "https://randomuser.me/api/portraits/women/48.jpg",
        title: "몰라몰라",
        commentCount: 20,
        created_date: "2024-12-12",
        id: 2,
        category : "공지 게시판"
    },
    {
        userName: "김개똥",
        profileUrl: "https://randomuser.me/api/portraits/women/48.jpg",
        title: "몰라몰라",
        commentCount: 20,
        created_date: "2024-12-12",
        id: 3,
        category : "자유 게시판"
    },
    {
        userName: "김개똥",
        profileUrl: "https://randomuser.me/api/portraits/women/48.jpg",
        title: "몰라몰라",
        commentCount: 20,
        created_date: "2024-12-12",
        id: 4,
        category : "번개 게시판"
    }
];

const dummyCategory = [
    {
        id: 1,
        title: "공지 게시판"
    },
    {
        id: 2,
        title: "자유 게시판"
    },
    {
        id: 3,
        title: "정모 게시판"
    }
];

export default function CommunityPostPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        if (event.key === 'Enter') {
            setSearchTerm(event.currentTarget.value);
            console.log('검색어:', event.currentTarget.value);

        }
    };

    return (
        <>
            <div className="pt-12">
                <CommunityInformCard clubName={"을왕리"} registeredTime={"2024-12-12"} memberType={"MEMBER"} memberCount={3}/>
            </div>

            <BoardList boardList={dummyData} categoryList={dummyCategory} />

            {/*<div className="flex justify-between">*/}
            {/*    <Button className=" " children="글쓰기" />*/}
            {/*    <div className="w-2/3">*/}
            {/*        <div className="relative ">*/}
            {/*            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground"/>*/}
            {/*            <Input placeholder="Search" defaultValue={searchTerm} className="pl-8" onKeyDown={handleSearchChange}/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<Card className="">*/}
            {/*    <CardHeader className="p-3 border-b">*/}
            {/*        <div className="flex items-center justify-between">*/}
            {/*            <Select>*/}
            {/*                <SelectTrigger className="w-[180px]">*/}
            {/*                    <SelectValue placeholder="정렬기준"/>*/}
            {/*                </SelectTrigger>*/}
            {/*                <SelectContent>*/}
            {/*                    <SelectGroup>*/}
            {/*                        <SelectItem value="apple">최신</SelectItem>*/}
            {/*                        <SelectItem value="banana">가장 오래된</SelectItem>*/}
            {/*                    </SelectGroup>*/}
            {/*                </SelectContent>*/}
            {/*            </Select>*/}

            {/*            <Select>*/}
            {/*                <SelectTrigger className="w-[180px]">*/}
            {/*                    <SelectValue placeholder="게시판"/>*/}
            {/*                </SelectTrigger>*/}
            {/*                <SelectContent>*/}
            {/*                    <SelectGroup>*/}
            {/*                        {dummyCategory.map((category) => (*/}
            {/*                            <SelectItem key={category.id} value={category.title}>{category.title}</SelectItem>*/}
            {/*                        ))}*/}
            {/*                    </SelectGroup>*/}
            {/*                </SelectContent>*/}
            {/*            </Select>*/}
            {/*        </div>*/}
            {/*    </CardHeader>*/}

            {/*    <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(90vh-120px)]">*/}
            {/*        <CardContent className="p-0">*/}
            {/*            <BoardItemProvider boardList={dummyData}/>*/}
            {/*        </CardContent>*/}
            {/*    </ScrollArea>*/}
            {/*</Card>*/}

            <div className="mb-4"></div>

            <div className="sticky bottom-24 right-4 flex justify-end">
                <Button className="rounded-full h-16 w-16 text-white">
                    <MessageCircleIcon className="h-12 w-12"/>
                </Button>
            </div>
        </>
    );
}
