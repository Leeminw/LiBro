"use client";
import SubHeader from "@/components/SubHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const SearchPage = () => {
  return (
    <>
      <SubHeader title="도서 검색" backArrow={true}/>
      <div className="pt-24 h-full max-h-screen flex items-center relative flex-wrap overflow-y-scroll scrollbar-hide">
        <div className="w-full h-32 bg-white rounded-lg mx-4 my-2 flex">
          
        </div>
        <div className="w-full h-56 bg-white rounded-lg mx-4 my-2 flex">
          
        </div>
        <div className="w-full h-56 bg-white rounded-lg mx-4 my-2 mb-24 flex">
          
        </div>
      </div>
    </>
  );
};
export default SearchPage;
