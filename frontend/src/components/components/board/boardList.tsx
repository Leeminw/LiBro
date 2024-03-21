'use client'

import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useEffect, useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import BoardItem from "@/components/components/board/boardItems";
import {useInView} from "react-intersection-observer";
import {useInfiniteQuery, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {getCategoryList, getPostList} from "@/lib/club";
import {useParams} from "next/navigation";
import {useRouter} from "next/navigation";


export default function BoardList() {
    // const { boardList, categoryList } = props;
    const {toast} = useToast();

    const param = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest'); // 초기 정렬 순서를 설정합니다. 여기서는 최신순으로 초기화합니다.
    const [selectedCategory, setSelectedCategory] = useState('');

    const {
        isLoading: isCategoryLoading,
        isFetching: isCategoryisFetching,
        data: categoryList,
        isError: isCategoryError,
        error: FetchingCategoryError,
        isSuccess: isCategorySuccess
    } = useSuspenseQuery({
        queryKey: ['clubCategory', param.id],
        queryFn: () => getCategoryList(param.id)
    });

    const {
        data: boards,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['articleList'],
        queryFn: ({pageParam}) => getPostList(param.id, {
            boardId: selectedCategory,
            sortOrder: sortOrder,
            keyword: searchTerm,
            articleId: pageParam
        }),
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
            return lastPage.content.length === 0 ? undefined : lastPage.content[lastPage.content.length - 1].id;
        },
    })

    const handleSearchChange = (event) => {
        if (event.key === 'Enter') {
            setSearchTerm(event.currentTarget.value);
            refetch();
        }
    };

    const handleSortChange = (event) => {
        setSortOrder(event);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event);
    };

    useEffect(() => {
        refetch();
    }, [sortOrder, selectedCategory]);

    const {ref, inView} = useInView();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);


    const  writeHandler =  () => {
        router.push(`/club/${param.id}/board/write`)
    };
    return (
        <>
            <div className="flex justify-between">
                <Button onClick={writeHandler} children="글쓰기"/>
                <div className="w-2/3">
                    <div className="relative ">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Search" defaultValue={searchTerm} className="pl-8"
                               onKeyDown={handleSearchChange}/>
                    </div>
                </div>
            </div>

            <Card className="">
                <CardHeader className="p-3 border-b">
                    <div className="flex items-center justify-between">
                        <Select onValueChange={handleSortChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="정렬기준"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="latest">최신</SelectItem>
                                    <SelectItem value="oldest">가장 오래된</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={handleCategoryChange} defaultValue={null}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="게시판"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={null}>전체 게시판</SelectItem>
                                    {categoryList?.map((category) => (
                                        <SelectItem key={category.id}
                                                    value={category.id}>{category.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(90vh-120px)]">
                    <CardContent className="p-0">

                        {
                            boards?.pages.flatMap(t => t.content).map((board) => (
                                <BoardItem key={board.id} articleId={board.id} name={board.name}
                                           picture={board.picture}
                                           title={board.title} commentCount={board.commentCount}
                                           createdDate={board.createdDate} category={board.category}/>
                            ))
                        }
                    </CardContent>
                </ScrollArea>
                <div ref={ref}></div>
            </Card>
        </>
    )
}
