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
  const [bookList, setBookList] = useState<Book[]>([]);
  const [start, setStart] = useState(Number(params.get("start")));
  const [curpage, setCurpage] = useState(Math.floor(start / 10) + 1);
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
              setBookList((bookList) => [
                ...bookList.slice(0, input - 1),
                ...data.items,
              ]);
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
  };
  useEffect(() => {
    updateBookList(start, true);
  }, []);

  return (
    <>
      <SubHeader title="도서 검색 결과" backArrow={true} />
      <div
        ref={scrollRef}
        className="py-24 flex h-full max-h-screen justify-center flex-wrap overflow-y-scroll relative"
      >
        {bookList.length > 0
          ? bookList.slice(start - 1, start + 49).map((book, index) => (
              <div
                onClick={() => {
                  router.push(`/detail?isbn=${book.isbn}`);
                }}
                key={book.isbn}
                className={`bg-white w-full h-56 mx-4 my-2 rounded-lg drop-shadow-md cursor-pointer ${
                  curpage - 1 ===
                  Math.floor(index / 10) + Math.floor(start / 10)
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
                  <p className="text-sm text-gray-900 break-words line-clamp-4">
                    {book.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{book.author}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {book.discount}원
                  </p>
                </div>
              </div>
            ))
          : null}
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
                      router.push(
                        `/search/result?query=${query}&start=${start - 50}`
                      );
                      updateBookList(start - 50, false);
                    }}
                  />
                </PaginationItem>
              )}
              {/* 페이지 버튼 */}
              {/* 
                    bookList.length 32 = 4출력
                    bookList.length가 51, 101, 125
                    start에 따라서...
                    Math.round(start / 10) = 0, 5, 10, 15, ...
                    *10 = 0, 50, 100, 150
              */}
              {Array.from(
                {
                  length:
                    Math.ceil(bookList.length / 10) % 5 === 1
                      ? 5
                      : Math.ceil(bookList.length / 10) % 5,
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
                      router.push(
                        `/search/result?query=${query}&start=${start + 50}`
                      );
                      updateBookList(start + 50, true);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};
export default ResultPage;
