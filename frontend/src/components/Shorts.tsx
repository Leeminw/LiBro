import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Skeleton } from "./ui/skeleton";
import { SearchApi } from "@/lib/axios-search";
const Shorts = ({ bookDetail, shortsLoad }: { bookDetail: BookShorts; shortsLoad: boolean }) => {
  const [bookmark, setBookmark] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div
      className={`snap-always snap-center shrink-0 w-full h-full min-h-60 flex items-center justify-center text-4xl font-bold text-white drop-shadow-lg`}
    >
      {shortsLoad ? (
        <div className="bg-white text-black flex justify-center rounded-lg items-center w-5/6 h-2/3 relative -translate-y-1">
          {/* 북마크 버튼 */}
          <div
            className="bg-black/50 hover:bg-black/30 rounded-full p-2 backdrop-blur-md absolute top-2 right-2 z-10 cursor-pointer transition-colors duration-150"
            onClick={() => {
              setBookmark(bookmark ? false : true);
              console.log(bookDetail.isbn + " 쇼츠 클릭 = " + bookDetail.isbn);
            }}
          >
            <div className="relative w-5 h-5">
              <BsBookmarkFill
                size={"1.2rem"}
                className={`text-white absolute transition ${
                  bookmark ? "opacity-100" : "opacity-0"
                } duration-150 ease-in-out`}
              />
              <BsBookmark size={"1.2rem"} className="text-white absolute" />
            </div>
          </div>
          {/* 도서 정보 */}
          <div
            className="absolute w-full h-1/3 z-10 bottom-0 cursor-pointer rounded-b-lg bg-gradient-to-t from-black/80 flex items-end"
            onClick={() => {
              router.push(`/detail?isbn=${bookDetail.isbn}`);
            }}
          >
            <div className="max-w-64 max-h-48 flex items-end justify-center">
              <Image
                src={bookDetail.image}
                alt=""
                width={200}
                height={400}
                className="px-3 pt-10 pb-4 select-none"
              />
            </div>
            <div className="text-white text-sm font-normal h-full w-full flex items-start flex-col select-none pt-14 pb-4 pr-2 justify-end">
              <div className="mb-2">
                <div className="text-md font-semibold overflow-ellipsis break-words line-clamp-2 mb-1">
                  {bookDetail.title}
                </div>
                <div className="text-xs text-[#CCCCCC] self-start break-words overflow-ellipsis">
                  {bookDetail.author.split("^").join(", ")}
                </div>
              </div>
              <div className="text-xs self-end">자세히 보기 &gt;</div>
            </div>
          </div>
          {/* 숏츠 */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full rounded-lg object-cover"
          >
            <source src={bookDetail.src} type="video/mp4" />
          </video>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Shorts;
