"use client";
import { BiBarcode } from "react-icons/bi";
import { IoMdHome } from "react-icons/io";
import { IoLibrary } from "react-icons/io5";
import { BsFillPersonFill, BsFillPeopleFill } from "react-icons/bs";
const BottomNavigation = () => {
  return (
    <div className="fixed z-50 w-full h-16 max-w-md -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-1 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto select-none">
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-100 dark:hover:bg-gray-800 group transition duration-300"
        >
          <IoMdHome
            aria-hidden="true"
            size={"1.8rem"}
            className="text-gray-500 dark:text-gray-400 group-hover:text-[#9268EB] dark:group-hover:text-[#9268EB] transition duration-300"
          />
          <span className="text-[0.6rem] overflow-hidden text-nowrap">홈</span>
        </button>
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group transition duration-300"
        >
          <BsFillPeopleFill
            aria-hidden="true"
            size={"1.8rem"}
            className="text-gray-500 dark:text-gray-400 group-hover:text-[#9268EB] dark:group-hover:text-[#9268EB] transition duration-300"
          />
          <span className="text-[0.6rem] overflow-hidden text-nowrap">
            커뮤니티
          </span>
        </button>

        <div className="flex flex-col items-center justify-center dark:text-gray-400">
          <button
            type="button"
            className="inline-flex flex-col items-center mt-[-2rem] mb-[0.3rem] aspect-square justify-center w-14 h-14 font-medium bg-[#9268EB] rounded-full hover:bg-[#684ba6] group text-white transition duration-300 ring-white ring-2"
          >
            <BiBarcode
              aria-hidden="true"
              size={"2.25rem"}
              style={{ color: "white" }}
            />
          </button>
          <span className="text-[0.6rem] overflow-hidden text-nowrap cursor-default">
            바코드 스캔
          </span>
        </div>

        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group transition duration-300"
        >
          <IoLibrary
            aria-hidden="true"
            size={"1.8rem"}
            className="text-gray-500 dark:text-gray-400 group-hover:text-[#9268EB] dark:group-hover:text-[#9268EB] transition duration-300"
          />
          <span className="text-[0.6rem] overflow-hidden text-nowrap">
            나의 서재
          </span>
        </button>
        <button
          type="button"
          className="inline-flex flex-col items-center rounded-e-full justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group transition duration-300"
        >
          <BsFillPersonFill
            aria-hidden="true"
            size={"1.8rem"}
            className="text-gray-500 dark:text-gray-400 group-hover:text-[#9268EB] dark:group-hover:text-[#9268EB] transition duration-300"
          />
          <span className="text-[0.6rem] overflow-hidden text-nowrap">
            마이페이지
          </span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
