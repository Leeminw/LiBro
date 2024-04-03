"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import BoardItem from "@/components/components/board/boardItems";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getCategoryList, getPostList } from "@/lib/club";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function BoardList() {
  // const { boardList, categoryList } = props;
  const { toast } = useToast();

  const param = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest"); // 초기 정렬 순서를 설정합니다. 여기서는 최신순으로 초기화합니다.
  const [selectedCategory, setSelectedCategory] = useState("0");

  const clubId = parseInt(param.id as string);
  const {
    isLoading: isCategoryLoading,
    isFetching: isCategoryisFetching,
    data: categoryList,
    isError: isCategoryError,
    error: FetchingCategoryError,
    isSuccess: isCategorySuccess,
  } = useSuspenseQuery({
    queryKey: ["clubCategory", clubId],
    queryFn: () => getCategoryList(clubId),
  });

  const {
    data: boards,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["articleList"],
    queryFn: ({ pageParam }) =>
      getPostList(clubId, {
        boardId: parseInt(selectedCategory),
        sortOrder: sortOrder,
        keyword: searchTerm,
        articleId: pageParam,
      }),
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      return lastPage.content.length === 0
        ? undefined
        : lastPage.content[lastPage.content.length - 1].id;
    },
    initialPageParam: null,
  });

  const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      refetch();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchTerm(value);
  };

  const handleSortChange = (event: string) => {
    setSortOrder(event);
  };

  const handleCategoryChange = (event: string) => {
    setSelectedCategory(event);
  };

  useEffect(() => {
    if (!isLoading || !isRefetching) refetch();
  }, [sortOrder, selectedCategory]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const writeHandler = () => {
    router.push(`/club/${clubId}/board/write`);
  };

  return (
    <>
      <div className="flex justify-between items-center px-2">
        <div className="w-full">
          <div className="relative  pr-2 py-2 flex items-center">
            <Search className="absolute h-4 w-4 text-muted-foreground ml-2" />
            <Input
              placeholder="Search"
              defaultValue={searchTerm}
              className="pl-8"
              onKeyDown={handleSearchChange}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <Button onClick={writeHandler} className="bg-[#9268EB] hover:bg-[#bfa1ff]">글쓰기</Button>
      </div>

      <Card className="mx-2">
        <CardHeader className="p-3 border-b">
          <div className="flex items-center justify-between">
            <Select onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] mr-2">
                <SelectValue placeholder="정렬기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="latest">최신</SelectItem>
                  <SelectItem value="oldest">가장 오래된</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={handleCategoryChange} defaultValue={"0"}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="게시판" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"0"}>전체 게시판</SelectItem>
                  {categoryList?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[60vh]">
          <CardContent className="p-0">
            {isSuccess &&
              boards?.pages
                .flatMap((t) => t.content)
                .map((board) => (
                  <BoardItem
                    key={board.id}
                    articleId={board.id}
                    name={board.name}
                    picture={board.picture}
                    title={board.title}
                    commentCount={board.commentCount}
                    createdDate={board.createdDate}
                    category={board.category}
                  />
                ))}

            {(isLoading || isRefetching) && (
              <div className="flex flex-col space-y-3">
                <Skeleton />
              </div>
            )}
          </CardContent>
        </ScrollArea>
        <div ref={ref}></div>
      </Card>
    </>
  );
}
