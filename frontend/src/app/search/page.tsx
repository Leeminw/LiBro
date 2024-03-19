"use client";
import SubHeader from "@/components/SubHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const SearchPage = () => {
  return (
    <>
      <SubHeader title="도서 검색" backArrow={true} />
      <div className="pt-24 h-full max-h-screen flex items-center relative flex-wrap overflow-y-scroll scrollbar-hide">
        <div className="w-full h-32 bg-white rounded-lg mx-4 my-2 flex flex-col relative overflow-hidden">
          <div className="ml-4 my-2 w-full select-none font-semibold text-gray-900">
            최근 검색어
          </div>
          <div className="w-full h-full px-4">
            {Array.from({length:10},(_, index)=>(
              <Badge className="mx-1" key={index}>테스트 {index}</Badge>
            ))
            }
          </div>
        </div>
        <div className="w-full h-56 bg-white rounded-lg mx-4 my-2 flex"></div>
        <div className="w-full h-56 bg-white rounded-lg mx-4 my-2 mb-24 flex"></div>
      </div>
    </>
  );
};
export default SearchPage;
