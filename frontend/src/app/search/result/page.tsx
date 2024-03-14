"use client";
interface book {
  title: string;
  image: string;
  author: string;
  discount: number;
  publisher: string;
  pubdate: string;
  isbn: string;
  description: string;
}
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
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
const ResultPage = () => {
  const [bookList, setBookList] = useState<book[]>([]);
  const params = useSearchParams();
  const query = params.get("query");
  const start = Number(params.get("start"));
  const [curpage, setCurpage] = useState(start / 10 + 1);

  useEffect(() => {
    if (query) {
      SearchApi.searchBooks(query, start)
        .then((data) => {
          console.log("응답 값", data);
          setBookList(data.items);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <SubHeader title="도서 검색 결과" backArrow={true} />
      <div className="py-24 flex h-full max-h-screen justify-center flex-wrap overflow-y-scroll relative">
        {bookList.length > 0
          ? bookList.map((book, index) => (
              <div
                key={book.isbn}
                className="bg-white w-full h-56 mx-4 my-2 rounded-lg drop-shadow-md flex cursor-pointer"
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
              {start != 1 ? (
                <PaginationItem>
                  <PaginationPrevious />
                </PaginationItem>
              ) : null}
              {Array.from({ length: bookList.length / 10 }, (_, index) => (
                <div key={index}>
                  <PaginationItem
                  className={index===curpage?'':''}
                  >
                    <PaginationLink
                      onClick={() => {
                        setCurpage((index + 1) % 5);
                      }}
                      isActive={index === curpage}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                </div>
              ))}
              {bookList.length == 51 ? (
                <PaginationItem>
                  <PaginationNext />
                </PaginationItem>
              ) : null}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};
export default ResultPage;
