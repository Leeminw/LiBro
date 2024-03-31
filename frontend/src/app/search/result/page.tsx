"use client";

import SubHeader from "@/components/SubHeader";
import { SearchApi } from "@/lib/axios-search";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
const ResultPage = () => {
  const params = useSearchParams();
  const query = params.get("query");
  const [bookList, setBookList] = useState<NaverBook[]>([]);
  const [start, setStart] = useState(Number(params.get("start")));
  const [curpage, setCurpage] = useState(Math.floor(start / 10) + 1);
  const [pageLoad, setPageLoad] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const updateBookList = (input: number, isNext: boolean) => {
    console.log("length : " + bookList.length + ", " + input);
    if (query) {
      if (isNext && bookList.length - 1 < input) {
        SearchApi.searchBooks(query, input)
          .then((data) => {
            console.log("응답 값", data);
            if (bookList.length === 0) setBookList(data.items);
            else {
              setBookList((bookList) => [...bookList.slice(0, input - 1), ...data.items]);
            }
          })
          .catch((err) => console.log(err));
      }
      setStart(input);
      if (isNext) {
        setCurpage(Math.floor(input / 10) + 1);
      } else {
        setCurpage(Math.floor(input / 10) + 5);
      }
    }
    setPageLoad(true);
  };
  useEffect(() => {
    updateBookList(start, true);
  }, [query]);

  useEffect(() => {}, []);

  return (
    <>
      <SubHeader title={`"${query}" 검색 결과`} backArrow={true} />
      <div
        ref={scrollRef}
        className="py-24 flex h-full max-h-screen justify-center flex-wrap overflow-y-scroll scrollbar-hide relative"
      >
        {pageLoad ? (
          bookList.length > 0 ? (
            bookList.slice(start - 1, start + 49).map((book, index) => (
              <div
                onClick={() => {
                  router.push(`/detail?isbn=${book.isbn}`);
                }}
                key={book.isbn}
                className={`bg-white w-full h-56 mx-4 my-2 rounded-lg drop-shadow-md cursor-pointer ${
                  curpage - 1 === Math.floor(index / 10) + Math.floor(start / 10)
                    ? "flex"
                    : "hidden"
                }`}
              >
                <Image
                  src={book.image}
                  alt=""
                  width={300}
                  height={400}
                  className="w-full h-full select-none max-w-36 p-4 drop-shadow-md"
                />
                <div className="py-4 pr-4 flex flex-col">
                  <p className="text-base font-semibold text-gray-900 break-words line-clamp-4">
                    {book.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{book.author.split("^").join(", ")}</p>
                  <p className="text-sm text-gray-500 mt-2">{book.discount}원</p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[75vh] flex items-center">검색 결과가 없습니다.</div>
          )
        ) : (
          <div className="h-[75vh] flex flex-col justify-center items-center">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 my-2"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            검색 결과를 불러오는중 ...
          </div>
        )}
        {bookList.length > 0 && (
          <div className="self-end bg-white py-1 my-2 px-3 rounded-full select-none">
            <Pagination>
              <PaginationContent>
                {/* 이전 버튼 */}
                {start != 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      className="rounded-full"
                      onClick={() => {
                        scrollTop();
                        router.push(`/search/result?query=${query}&start=${start - 50}`);
                        updateBookList(start - 50, false);
                      }}
                    />
                  </PaginationItem>
                )}
                {/* 페이지 버튼 */}
                {Array.from(
                  {
                    length: bookList.length >= start + 49 ? 5 : Math.ceil(bookList.length / 10) % 5,
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
                            console.log(bookList);
                            scrollTop();
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
                {Math.floor(start / 50) * 50 + 50 <= bookList.length && (
                  <PaginationItem>
                    <PaginationNext
                      className="rounded-full"
                      onClick={() => {
                        scrollTop();
                        router.push(`/search/result?query=${query}&start=${start + 50}`);
                        updateBookList(start + 50, true);
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
};
export default ResultPage;
