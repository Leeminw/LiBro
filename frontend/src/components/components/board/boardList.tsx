'use client'

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import BoardItemProvider from "@/components/components/board/boardItemProvider";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface BoardListProps {
    categoryList: Category[];
    boardList: Post[];
}

export default function BoardList(props: BoardListProps) {
    const { boardList, categoryList } = props;
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest'); // 초기 정렬 순서를 설정합니다. 여기서는 최신순으로 초기화합니다.
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        toast(
            {
                title: "검색하였습니다..",
                description: `카테고리: ${selectedCategory}, 정렬순서: ${sortOrder} title: ${searchTerm}}`
            }
        )
    }, [selectedCategory, sortOrder, searchTerm]); // searchTerm도 추가합니다.

    const handleSearchChange = (event) => {
        if (event.key === 'Enter') {
            setSearchTerm(event.currentTarget.value);
        }
    };

    const handleSortChange = (event) => {
        setSortOrder(event)
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event); // 선택된 카테고리로 설정합니다.
    };

    return (
        <>
            <div className="flex justify-between">
                <Button className=" " children="글쓰기" />
                <div className="w-2/3">
                    <div className="relative ">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search" defaultValue={searchTerm} className="pl-8"
                               onKeyDown={handleSearchChange} />
                    </div>
                </div>
            </div>

            <Card className="">
                <CardHeader className="p-3 border-b">
                    <div className="flex items-center justify-between">
                        <Select onValueChange={handleSortChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="정렬기준" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="latest">최신</SelectItem>
                                    <SelectItem value="oldest">가장 오래된</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="게시판" />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectGroup>
                                    {categoryList?.map((category) => (
                                        <SelectItem key={category.id}
                                                    value={category.title}>{category.title}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(90vh-120px)]">
                    <CardContent className="p-0">
                        <BoardItemProvider boardList={boardList} />
                    </CardContent>
                </ScrollArea>
            </Card>
        </>
    )
}
