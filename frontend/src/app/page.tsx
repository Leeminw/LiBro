"use client";
import Shorts from "@/components/Shorts";
import { useEffect, useRef, useState } from "react";
import SubHeader from "@/components/SubHeader";
import { SearchApi } from "@/lib/axios-search";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [currentLoad, setCurrentLoad] = useState<boolean[]>([]);
  const [bookList, setBookList] = useState<BookShorts[]>([]);
  const [pageLoad, setPageLoad] = useState<boolean>(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageLoad) {
      setPageLoad(true);
    } else {
      const requestBooks = async () => {
        await SearchApi.searchBooks("플라톤", 1)
          .then((data) => {
            console.log("응답 값", data);
            const updateBookList = data.items.map((item: Book) => ({
              title: item.title,
              image: item.image,
              author: item.author,
              publisher: item.publisher,
              isbn: item.isbn,
              src: item.isbn % 2 == 0 ? "ex00.mp4" : "ex01.mp4",
            }));
            // 일단 10개까지만 로드
            setBookList(updateBookList.slice(0, 10));
            setCurrentLoad(
              Array(updateBookList.slice(0, 10).length).fill(false)
            );
            setCurrentLoad((current) =>
              current.map((item, index) => (index === 0 ? true : item))
            );
            loadComplete(updateBookList.slice(0, 10).length);
          })
          .catch((err) => console.log(err));
      };
      requestBooks();
    }
  }, [pageLoad]);

  const loadComplete = (bookLength: number) => {
    const handleScroll = (event: Event) => {
      if (carouselRef.current) {
        const element: HTMLDivElement = carouselRef.current;
        const totalScrollHeight = element.scrollHeight - element.clientHeight;
        const scrollRatio = element.scrollTop / totalScrollHeight;
        const currentIndex = Math.round(scrollRatio * (bookLength - 1));
        setCurrentLoad((current) =>
          current.map((item, index) => (index === currentIndex ? true : item))
        );
        // console.log("currentIndex", currentIndex);
      }
    };
    const element = carouselRef.current;
    if (element) {
      element.addEventListener("scrollend", handleScroll);
      return () => element.removeEventListener("scrollend", handleScroll);
    }
  };

  return (
    <>
      <SubHeader title="오늘의 도서 추천" backArrow={false} />
      <div
        ref={carouselRef}
        className="flex overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        <div className="flex flex-col max-h-screen flex-nowrap w-full">
          {pageLoad ? (
            <>
              {bookList.map((id, idx) => (
                <Shorts
                  key={id.isbn}
                  shortsLoad={currentLoad[idx]}
                  bookDetail={id}
                />
              ))}
            </>
          ) : (
            <div className="w-full h-full min-h-screen flex items-center justify-center text-4xl font-bold text-white drop-shadow-lg">
              <div className="bg-gray-300 text-black flex justify-end rounded-lg items-start w-3/4 h-2/3 relative animate-pulse">
                <div className="absolute w-full h-1/3 z-10 bottom-0 cursor-pointer rounded-b-lg bg-gradient-to-t from-black/40 flex p-4">
                  <Skeleton className="h-full min-w-20" />
                  <div className="flex flex-col w-full pt-4 pl-4 justify-end space-y-2">
                    <Skeleton className="h-1/3 w-full rounded-lg" />
                    <Skeleton className="h-1/2 w-full rounded-lg" />
                  </div>
                </div>
                <Skeleton className="h-10 w-10 rounded-full m-2" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
