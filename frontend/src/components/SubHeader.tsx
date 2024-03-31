"use client";
import { FaChevronLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
const SubHeader = ({ title, backArrow }: { title: string; backArrow: boolean }) => {
  const router = useRouter();
  return (
    <>
      <div className="border-b border-gray-200 bg-white w-full flex h-14 items-center mt-12 pl-2 text-md font-semibold text-[#333333] absolute z-10">
        {backArrow ? (
          <FaChevronLeft
            className="cursor-pointer mx-1"
            size={"1.2rem"}
            onClick={() => {
              router.back();
            }}
          />
        ) : null}
        <div className="ml-2 select-none line-clamp-1 text-ellipsis pr-2 text-lg font-bold animate-fade-up ">
          {title}
        </div>
      </div>
      <div className="h-10 absolute"></div>
    </>
  );
};
export default SubHeader;
