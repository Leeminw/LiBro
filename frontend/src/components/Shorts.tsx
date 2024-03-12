type ShortsProps = {
  idx: number;
};
import Image from "next/image";
import { useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
const Shorts: React.FC<ShortsProps> = ({ idx }) => {
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
            src="https://shopping-phinf.pstatic.net/main_3681879/36818792620.20230829091541.jpg"
            alt=""
            width={100}
            height={100}
            className="px-3 py-5 select-none"
          />
          <div className="text-white text-sm h-full w-full flex items-center flex-col justify-center select-none">
            <div>{idx}번 쇼츠</div>
            <div>어쩌구저쩌구</div>
            <div>자세히보기</div>
          </div>
        </div>
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
