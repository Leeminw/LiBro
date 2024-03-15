'use client';
import { FaChevronLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
const SubHeader = ({
  title,
  backArrow
}: {
  title: string;
  backArrow: boolean;
}) => {
  const router = useRouter();
  return (
    <div className="border-b border-gray-200 bg-white w-full flex h-10 items-center mt-14 pl-2 text-md font-semibold text-[#333333] absolute z-10">
      {backArrow ? (
        <FaChevronLeft
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
      ) : null}
      <div className="ml-2 select-none">{title}</div>
    </div>
  );
};
export default SubHeader;
