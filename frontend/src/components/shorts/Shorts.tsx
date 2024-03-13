import Image from "next/image";
import { useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
const Shorts = ({ idx }: { idx: number }) => {
  const URL = "ex0" + 0 + ".mp4";
  const [bookmark, setBookmark] = useState<boolean>(false);
  return (
    <div
      className={`snap-always snap-center shrink-0 w-full h-full min-h-40 flex items-center justify-center text-4xl font-bold text-white drop-shadow-lg`}
    >
      <div className="bg-white text-black flex justify-center rounded-lg items-center w-3/4 h-2/3 relative">
        {/* 북마크 버튼 */}
        <div
          className="bg-black/50 hover:bg-black/30 rounded-full p-2 backdrop-blur-md absolute top-2 right-2 z-10 cursor-pointer transition-colors duration-150"
          onClick={() => {
            setBookmark(bookmark ? false : true);
            console.log(idx + "번 쇼츠 클릭");
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
        <div className="absolute w-full h-1/3 z-10 bottom-0 rounded-b-lg bg-gradient-to-t from-black/80 flex">
          <Image
            src="https://shopping-phinf.pstatic.net/main_3245593/32455932298.20230313183629.jpg"
            alt=""
            width={100}
            height={200}
            className="px-3 pt-7 pb-5 select-none"
          />
          <div className="text-white text-sm font-normal h-full w-full flex items-start flex-col select-none pt-14 pb-4 pr-2 justify-end">
            <div className="mb-2">
              <div className="text-md font-semibold overflow-ellipsis break-words line-clamp-2 mb-1">
                우린 한낮에도 프리랜서를 꿈꾸지 {idx}편
              </div>
              <div className="text-xs text-[#CCCCCC] self-start break-words overflow-ellipsis">
                저자 박현아 | 출판사 세나북스
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
          <source src={URL} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default Shorts;
