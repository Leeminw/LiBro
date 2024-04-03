"use client";
import Shorts from "@/components/Shorts";
import { useEffect, useRef, useState } from "react";
import SubHeader from "@/components/SubHeader";
import { ShortsApi } from "@/lib/axios-shorts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [currentLoad, setCurrentLoad] = useState<boolean[]>([]);
  const [bookList, setBookList] = useState<BookShorts[]>([]);
  const [pageLoad, setPageLoad] = useState<boolean>(false);
  const [curIndex, setCurIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [bgm, setBgm] = useState<string>("bgm0" + Math.floor(Math.random() * 10) + ".mp3");
  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // ES6의 구조 분해 할당을 사용하여 요소를 교환
    }
    return array;
  }
  useEffect(() => {
    if (!pageLoad) {
      setPageLoad(true);
    } else {
      const requestBooks = async () => {
        await ShortsApi.loadShorts(!!localStorage.getItem("accessToken"))
          .then(async (data) => {
            console.log("응답 값", data);
            // const updateBookList = data.data.map((item:MainBook) => ({
            //   title: item.title,
            //   image: item.thumbnail,
            //   author: item.author,
            //   publisher: item.publisher,
            //   isbn: item.isbn,
            //   src: item.shorts_url,
            // }));
            let inputIsbn = [
              9791193839010, 9791191657111, 9791192483207, 9791193324141, 9791192579887,
              9791193128381, 9788937460753, 9791192674414, 9788954697354, 9791192579504,
              9791191290271, 9791193080122, 9791166836404, 9788998441074, 9788937443848,
              9788974314040, 9791190073240, 9791168682429, 9788932027098, 9788936448523,
            ];
            const shuffledIsbnList: BookShorts[] = [];
            for (let i = 0; i < inputIsbn.length; i++) {
              await ShortsApi.loadTestShorts(inputIsbn[i].toString())
                .then((responseData) => {
                  console.log(responseData);
                  shuffledIsbnList.push({
                    title: responseData.data[0].title,
                    image: responseData.data[0].thumbnail,
                    author: responseData.data[0].author,
                    publisher: responseData.data[0].publisher,
                    isbn: responseData.data[0].isbn,
                    src: responseData.data[0].shortsUrl,
                  });
                })
                .catch(() => {});
            }
            // isbnList를 랜덤하게 섞기
            const updateBookList = shuffleArray([...shuffledIsbnList]);
            // 일단 50개까지만 로드
            setBookList(updateBookList.slice(0, 50));
            setCurrentLoad(Array(updateBookList.slice(0, 50).length).fill(false));
            setCurrentLoad((current) => current.map((item, index) => (index < 5 ? true : item)));
            loadComplete(updateBookList.slice(0, 50).length);
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
        if (curIndex != currentIndex) {
          setCurIndex(currentIndex);
          setBgm("bgm0" + Math.floor(Math.random() * 10) + ".mp3");
          console.log(bgm);
        }
        setCurrentLoad((current) =>
          current.map((item, index) =>
            index + 2 >= currentIndex && index - 2 <= currentIndex ? true : item
          )
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

      <div ref={carouselRef} className="flex overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        <div className="flex flex-col max-h-[90vh] flex-nowrap w-full">
          {pageLoad ? (
            <>
              <audio src={bgm} loop autoPlay></audio>
              {bookList.map((id, idx) => (
                <Shorts key={id.isbn} shortsLoad={currentLoad[idx]} bookDetail={id} />
              ))}
            </>
          ) : (
            <div className="w-full h-full min-h-screen max-h-screen flex items-center justify-center text-4xl font-bold text-white drop-shadow-lg">
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
