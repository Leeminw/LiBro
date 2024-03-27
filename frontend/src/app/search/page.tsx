"use client";
import SubHeader from "@/components/SubHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
const SearchPage = () => {
  return (
    <>
      <SubHeader title="도서 검색" backArrow={true} />
      <div className="pt-24 h-full max-h-screen flex items-center relative flex-wrap overflow-y-scroll scrollbar-hide">
        <div className="w-full min-h-24 h-fit pb-4 bg-white rounded-lg mx-4 my-2 flex flex-col relative overflow-hidden drop-shadow-lg">
          <div className="ml-4 mt-3 mb-2 w-full select-none font-semibold text-gray-900">
            최근 검색어
          </div>
          <div className="w-full px-4 space-y-1">
            {Array.from({ length: 10 }, (_, index) => (
              <Badge className="mx-1 cursor-pointer" key={index}>
                테스트 {index}
              </Badge>
            ))}
          </div>
        </div>
        <div className="w-full h-56 bg-white rounded-lg mx-4 my-2 flex relative drop-shadow-lg flex-col">
          <div className="ml-4 mt-3 mb-2 w-fit select-none font-semibold text-gray-900">
            최근에 본 책
          </div>
          <div className="absolute bg-white rounded-lg px-4 pb-2 flex overflow-y-scroll overflow-x-hidden scrollbar-hide rotate-90 space-y-4">
            {Array.from({ length: 10 }, (_, index) => (
              <Image
                key={index}
                src="https://shopping-phinf.pstatic.net/main_4060177/40601771618.20231004072429.jpg"
                alt=""
                width={100}
                height={200}
                className="select-none -rotate-90"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchPage;
