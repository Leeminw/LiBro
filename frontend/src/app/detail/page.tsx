"use client";

import SubHeader from "@/components/SubHeader";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import DetailAnalyze from "@/components/components/detailAnalyze";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaStar } from "react-icons/fa6";
import { RiPencilFill } from "react-icons/ri";
import { SearchApi } from "@/lib/axios-search";
import { dateFormatter } from "@/lib/date-formatter";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/interceptor";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";

const DetailPage = () => {
  const URL = "ex0" + 0 + ".mp4";
  const isbn = useSearchParams().get("isbn");
  const ratingRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [bookLoading, setBookLoading] = useState<boolean>(false);
  const [bookDetail, setBookDetail] = useState<Book>({
    title: "",
    thumbnail: "",
    author: "",
    price: 0,
    publisher: "",
    pub_date: "",
    isbn: 0,
    summary: "",
    translator: null,
    updated_date: "",
    created_date: "",
    rating: 0,
    rating_count: 0,
    id: 0,
    shorts_url: "",
  });
  const [start, setStart] = useState<number>(1);
  const [curpage, setCurpage] = useState<number>(1);
  const [rating, setRating] = useState([
    {
      nickname: "A",
      email: "A0@A.com",
      rating: 1,
      comment: "정말 재미없어요",
      createdDate: "2022-01-03",
    },
    {
      nickname: "A",
      email: "A1@A.com",
      rating: 1,
      comment: "정말 재미없어요",
      createdDate: "2022-01-03",
    },
  ]);

  const ratingPaging = (input: number, isNext: boolean) => {
    setStart(input);
    if (isNext) {
      setCurpage(Math.floor(input / 10) + 1);
    } else {
      setCurpage(Math.floor(input / 10) + 5);
    }
  };

  useEffect(() => {
    const updateBookDetail = () => {
      if (isbn) {
        SearchApi.searchBooks(isbn, 1)
          .then((data) => {
            console.log("응답 값", data);
            setBookDetail({
              title: data.items[0].title,
              thumbnail: data.items[0].image,
              author: data.items[0].author,
              price: data.items[0].discount,
              publisher: data.items[0].publisher,
              pub_date: data.items[0].pubdate,
              isbn: data.items[0].isbn,
              summary: data.items[0].description,
              translator: null,
              updated_date: "",
              created_date: "",
              rating: 0,
              rating_count: 0,
              id: 0,
              shorts_url: "",
            });
            setBookLoading(true);
          })
          .catch((err) => {
            toast({
              title: "오류",
              description:
                "도서 정보를 불러오는데 실패했습니다.\n다시 시도해주세요.",
            });
            router.back();
            console.log(err);
          });
      }
    };
    updateBookDetail();
  }, []);
  const mappingBook = async () => {
    let response, postResponse;
    // 검색을 했을때 isbn이 db에 있는지 확인하기
    try {
      response = await instance.get("/api/v1/book/search", {
        params: {
          key: "isbn",
          word: bookDetail.isbn,
          page: 0,
          size: 0,
        },
      });
      // 데이터가 없는경우 등록
      if (response.data.data.length === 0) {
        console.log("do this");
        const dateString: string = bookDetail.pub_date;
        const formattedDateString: string = `${dateString.slice(
          0,
          4
        )}-${dateString.slice(4, 6)}-${dateString.slice(6)}`;
        const isoDateTime: String = new Date(formattedDateString).toISOString();
        const addBook = {
          isbn: bookDetail.isbn,
          title: bookDetail.title,
          summary: bookDetail.summary,
          price: bookDetail.price,
          author: bookDetail.author,
          publisher: bookDetail.publisher,
          pubDate: isoDateTime,
          thumbnail: bookDetail.thumbnail,
        };
        postResponse = await instance.post("api/v1/book", addBook);
      }
      // mapping
      const data = postResponse?.data.data || response.data.data[0];
      console.log(data);
      const bookId = data.id;
      // // 이미 되어있는지 확인하기 todo
      console.log(bookId);
      // mapping
      const mappingResponse = await instance.post("/api/v1/userbook", {
        bookId: bookId,
        type: "관심",
      });

      console.log(mappingResponse.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <SubHeader title="도서 상세 정보" backArrow={true} />
      <div className="pt-24 h-full bg-white max-h-screen flex items-center relative flex-wrap overflow-y-scroll scrollbar-hide">
        {bookLoading ? (
          <div className="w-full h-full min-h-screen bg-white flex flex-col relative overflow-hidden mb-24">
            <div
              className="w-full h-40 flex relative"
              style={{
                backgroundImage: `url(${bookDetail.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="w-full h-full backdrop-blur-lg backdrop-brightness-75 flex absolute pr-2">
                <Image
                  src={bookDetail.thumbnail}
                  alt=""
                  width={100}
                  height={200}
                  className="px-3 py-4 select-none"
                />
                <div className="flex items-end mb-4">
                  <div className="flex flex-col">
                    <p className="text-white font-semibold text-lg line-clamp-3">
                      {bookDetail.title}
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      저자 {bookDetail.author.split("^").join(", ")} | 출판사{" "}
                      {bookDetail.publisher}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-full px-6">
              <p className="mt-4 mb-3 text-lg text-gray-800 font-semibold">
                트레일러
              </p>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[64vh] rounded-lg object-cover"
              >
                <source src={URL} type="video/mp4" />
              </video>

              <div className="mt-8 w-full h-fit">
                <p className="text-lg text-gray-800 font-semibold">책 소개</p>
                <hr className="mt-2 mb-3" />
                <p className="text-xs text-gray-600 leading-6 indent-1.5">
                  {bookDetail.summary}
                </p>
              </div>

              <div className="mt-8 w-full h-fit">
                <p className="text-lg text-gray-800 font-semibold">기본 정보</p>
                <hr className="mt-2 mb-3" />
                <div className="flex flex-wrap text-sm text-gray-600">
                  <p className="w-1/3 my-1">ISBN</p>
                  <p className="w-2/3 my-1">{bookDetail.isbn}</p>
                  <p className="w-1/3 my-1">발행 일자</p>
                  <p className="w-2/3 my-1">{bookDetail.pub_date}</p>
                  <p className="w-1/3 my-1">가격</p>
                  <p className="w-2/3 my-1">{bookDetail.price}원</p>
                </div>
              </div>

              {/* 분석 */}
              <div className="mt-8 w-full h-fit">
                <p className="text-lg text-gray-800 font-semibold">분석</p>
                <hr className="mt-2 mb-4" />
                <div>
                  <div className="w-full flex justify-between px-1 pb-1">
                    <Label className="text-xs text-gray-800">완독율</Label>
                    <Label className="text-xs text-gray-800">33%</Label>
                  </div>
                  <Progress
                    indicatorColor="rounded-full bg-[#9268EB] duration-500"
                    value={33}
                  />
                  <div className="w-full px-1 flex justify-between pt-1">
                    <Label className="text-xs text-[#666666]">
                      완독 수 115
                    </Label>
                    <Label className="ml-4 text-xs text-[#666666]">
                      담은 수 231
                    </Label>
                  </div>
                  <div className="w-full flex justify-between px-1 pb-1 mt-6 flex-wrap">
                    <Label className="text-xs text-gray-800 font-semibold pb-2">
                      성별 / 연령대 분석
                    </Label>
                    <div className="w-full h-36 flex justify-between">
                      <div className="w-full h-36 flex flex-col absolute justify-between my-2">
                        <hr className="w-5/6 border-gray-300 mx-6" />
                        <hr className="w-5/6 border-gray-300 mx-6" />
                        <hr className="w-5/6 border-gray-300 mx-6" />
                        <hr className="w-5/6 border-gray-300 mx-6" />
                        <hr className="w-5/6 border-gray-300 mx-6" />
                      </div>
                      <div className="text-xs flex w-full justify-between pr-2">
                        <div className="h-40 flex flex-col justify-between">
                          <p className="text-right">100</p>
                          <p className="text-right">75</p>
                          <p className="text-right">50</p>
                          <p className="text-right">25</p>
                          <p className="text-right">0</p>
                        </div>
                        <DetailAnalyze
                          male={30}
                          female={70}
                          isLeft={false}
                          total={20}
                          description="10대"
                        />
                        <DetailAnalyze
                          male={40}
                          female={60}
                          isLeft={false}
                          total={20}
                          description="20대"
                        />
                        <DetailAnalyze
                          male={70}
                          female={30}
                          isLeft={false}
                          total={60}
                          description="30대"
                        />
                        <DetailAnalyze
                          male={10}
                          female={90}
                          isLeft={true}
                          total={20}
                          description="40대"
                        />
                        <DetailAnalyze
                          male={20}
                          female={80}
                          isLeft={true}
                          total={10}
                          description="50대"
                        />
                        <DetailAnalyze
                          male={50}
                          female={50}
                          isLeft={true}
                          total={10}
                          description="60대 이상"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 리뷰 */}
              <div ref={ratingRef} className="mt-8 w-full h-fit">
                <p className="text-lg text-gray-800 font-semibold">리뷰</p>
                <hr className="mt-2 mb-3" />
              </div>
              <div className="flex items-center mb-2">
                <FaStar className="w-6 h-6 text-yellow-300 me-1" />
                <FaStar className="w-6 h-6 text-yellow-300 me-1" />
                <FaStar className="w-6 h-6 text-yellow-300 me-1" />
                <FaStar className="w-6 h-6 text-yellow-300 me-1" />
                <FaStar className="w-6 h-6 text-gray-300 me-1" />
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  4.95점
                </p>
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  /
                </p>
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  5점
                </p>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                1,745개의 리뷰가 있습니다.
              </p>
              <div className="flex items-center mt-4">
                <p className="text-sm w-4 font-medium text-blue-600 dark:text-blue-500 select-none">
                  5
                </p>
                <Progress
                  className="ml-2 mr-4"
                  indicatorColor="bg-yellow-300 w-full h-5 rounded-full"
                  value={70}
                />
                <p className="text-sm w-8 text-end font-medium text-gray-500 dark:text-gray-400">
                  70%
                </p>
              </div>
              <div className="flex items-center mt-4">
                <p className="text-sm w-4 font-medium text-blue-600 dark:text-blue-500 select-none">
                  4
                </p>
                <Progress
                  className="ml-2 mr-4"
                  indicatorColor="bg-yellow-300 w-full h-5 rounded-full"
                  value={17}
                />
                <p className="text-sm w-8 text-end font-medium text-gray-500 dark:text-gray-400">
                  17%
                </p>
              </div>
              <div className="flex items-center mt-4">
                <p className="text-sm w-4 font-medium text-blue-600 dark:text-blue-500 select-none">
                  3
                </p>
                <Progress
                  className="ml-2 mr-4"
                  indicatorColor="bg-yellow-300 w-full h-5 rounded-full"
                  value={8}
                />
                <p className="text-sm w-8 text-end font-medium text-gray-500 dark:text-gray-400">
                  8%
                </p>
              </div>
              <div className="flex items-center mt-4">
                <p className="text-sm w-4 font-medium text-blue-600 dark:text-blue-500 select-none">
                  2
                </p>
                <Progress
                  className="ml-2 mr-4"
                  indicatorColor="bg-yellow-300 w-full h-5 rounded-full"
                  value={4}
                />
                <p className="text-sm w-8 text-end font-medium text-gray-500 dark:text-gray-400">
                  4%
                </p>
              </div>
              <div className="flex items-center mt-4">
                <p className="text-sm w-4 font-medium text-blue-600 dark:text-blue-500 select-none">
                  1
                </p>
                <Progress
                  className="ml-2 mr-4"
                  indicatorColor="bg-yellow-300 w-full h-5 rounded-full"
                  value={4}
                />
                <p className="text-sm w-8 text-end font-medium text-gray-500 dark:text-gray-400">
                  4%
                </p>
              </div>
              <div className="mt-8 w-full h-fit pl-1">
                {/* 리뷰 */}
                {rating
                  .slice((curpage - 1) * 10, (curpage - 1) * 10 + 10)
                  .map((key, index) => (
                    <div
                      key={key.email}
                      className="flex flex-col justify-between bg-white border border-gray-200 w-full h-28 rounded-lg drop-shadow-md p-4 my-4"
                    >
                      <p className="font-semibold text-sm">
                        {key.nickname} {key.email} | {key.createdDate}
                      </p>
                      <div className="flex">
                        <FaStar className="w-5 h-5 text-yellow-300 me-1" />
                        <FaStar className="w-5 h-5 text-yellow-300 me-1" />
                        <FaStar className="w-5 h-5 text-yellow-300 me-1" />
                        <FaStar className="w-5 h-5 text-yellow-300 me-1" />
                        <FaStar className="w-5 h-5 text-gray-300 me-1" />
                      </div>
                      <p className="text-sm">{key.comment}</p>
                    </div>
                  ))}
              </div>
              <Pagination>
                <PaginationContent>
                  {/* 이전 버튼 */}
                  {start != 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        className="rounded-full"
                        onClick={() => {
                          ratingRef.current?.scrollIntoView({
                            behavior: "smooth",
                          });
                          ratingPaging(start - 50, false);
                        }}
                      />
                    </PaginationItem>
                  )}
                  {/* 페이지 버튼 */}
                  {Array.from(
                    {
                      length:
                        start + 49 <= rating.length
                          ? 5
                          : Math.ceil((rating.length % 50) / 10),
                    },
                    (_, index) => (
                      <div key={index}>
                        <PaginationItem>
                          <PaginationLink
                            className={
                              index === (curpage - 1) % 5
                                ? "cursor-default bg-[#9268EB] hover:bg-[#684ba6] text-white hover:text-white rounded-full"
                                : "cursor-pointer rounded-full"
                            }
                            onClick={() => {
                              ratingRef.current?.scrollIntoView({
                                behavior: "smooth",
                              });
                              setCurpage(index + 1 + Math.round(start / 10));
                              console.log(index + 1 + Math.round(start / 10));
                            }}
                            isActive={index === (curpage - 1) % 5}
                          >
                            {index + 1 + Math.round(start / 10)}
                          </PaginationLink>
                        </PaginationItem>
                      </div>
                    )
                  )}
                  {/* 다음 버튼 */}
                  {start + 50 <= rating.length && (
                    <PaginationItem>
                      <PaginationNext
                        className="rounded-full"
                        onClick={() => {
                          ratingRef.current?.scrollIntoView({
                            behavior: "smooth",
                          });
                          ratingPaging(start + 50, true);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 w-full min-h-[84vh]">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-[360px] w-full rounded-xl" />
          </div>
        )}

        {bookLoading ? (
          <Button
            className="bg-[#9268EB] hover:bg-[#bfa1ff] sticky bottom-20 left-full max-w-md drop-shadow-lg rounded-full z-20 w-12 h-12 mr-3"
            onClick={() => mappingBook()}
          >
            <FaPlus size={30} />
          </Button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default DetailPage;
