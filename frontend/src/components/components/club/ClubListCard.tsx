'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent} from '@/components/ui/card'; // your-component-library에 실제로 사용하는 라이브러리 명을 입력해야 합니다.
import {CalendarIcon, Search} from "lucide-react"
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useInView} from "react-intersection-observer";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getClubList} from "@/lib/club";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Skeleton} from "@/components/ui/skeleton";
import {dateView} from "@/lib/dayjs";
import Link from "next/link";
import useUserState from "@/lib/login-state";

const FindClubCard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest'); // 초기 정렬 순서를 설정합니다. 여기서는 최신순으로 초기화합니다.

    const {getUserInfo} = useUserState();
    const userId = getUserInfo().id;
    const isMember = userId !== 0;

    const {
        data: clubs,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
        isSuccess
    } = useInfiniteQuery({
        queryKey: ['clubList'],
        queryFn: ({pageParam}) => getClubList({
            sortOrder: sortOrder,
            keyword: searchTerm,
            clubId: pageParam,
        }),
        getNextPageParam: (lastPage, allPages) => {

            const nextCursor = lastPage.content.length === 0 ? undefined : lastPage.content[lastPage.content.length - 1].clubId;
            console.log(nextCursor)
            return nextCursor;
        },
        initialPageParam: Number.POSITIVE_INFINITY
    })

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setSearchTerm(event.currentTarget.value);
        }
    };

    const handleSortChange = (event: string) => {
        setSortOrder(event);
    };

    const {ref, inView} = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView]);

    useEffect(() => {
        refetch();
    }, [sortOrder, searchTerm]);

    if (isLoading) {
        return <Skeleton></Skeleton>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    return isSuccess && (
        <>
            <div className="flex items-center justify-between w-2/3">
                <Select onValueChange={handleSortChange}>
                    <SelectTrigger className={""}>
                        <SelectValue placeholder="정렬기준"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="latest">최신</SelectItem>
                            <SelectItem value="oldest">가장 오래된</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-2/3">
                <div className="relative ">
                    <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground"/>
                    <Input placeholder="Search" className="pl-8" onKeyDown={handleSearchKeyDown}/>
                </div>
            </div>

            <Card>
                <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(100vh-140px)]">
                    <div>
                        {clubs.pages.flatMap(t => t.content).map((club) => (
                            <Card key={club.clubId} className="pt-6 bg-white rounded-lg shadow-md mt-2 mb-2">
                                <CardContent>
                                    <Link href={`/club/${club.clubId}`}
                                          className="text-lg font-bold">{club.clubName}</Link>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <CalendarIcon className="w-4 h-4 text-gray-500"/>
                                        <span className="text-sm text-gray-500">{dateView(club.createdDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        {club.clubOwnerName}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div ref={ref}></div>
                </ScrollArea>

                <div className="mb-16"/>
            </Card>
        </>
    );
};

export default FindClubCard;
