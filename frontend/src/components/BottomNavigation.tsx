import { Button } from "@/components/ui/button";
import { BiBarcode } from "react-icons/bi";
import { IoMdHome } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { IoLibrary } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
const BottomNavigation = () => {
  return (
    <div className="w-full h-16 flex justify-between fixed max-w-md bottom-0">
      <div className="grid grid-cols-5 w-[100%] gap-2 bg-black">
        <div className="flex-col overflow-hidden flex items-center bg-white">
          <IoMdHome size={"2.5em"} />홈
        </div>
        <div className="flex-col overflow-hidden flex items-center bg-white">
          <IoPeople size={"2.5em"} />커뮤니티
        </div>
        <div className="rounded-full flex-col overflow-hidden flex items-center bg-white mt-[-1rem] aspect-square">
          <BiBarcode size={"2.5em"} />도서 검색
        </div>
        <div className="flex-col overflow-hidden flex items-center bg-white">
          <IoLibrary size={"2.5em"} />나의 서재
        </div>
        <div className="flex-col overflow-hidden flex items-center bg-white">
          <FaUser size={"2.5em"} />내 정보
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
