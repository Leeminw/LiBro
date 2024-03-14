"use client";
import { Button } from "./ui/button";
import { AiOutlineSearch } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useRef } from "react";
const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const handleSearch = () => {
    if (searchRef.current) {
      router.push(`/search/result?query=${searchRef.current.value}&start=1`);
    }
  };
  const handleSearchPage = () => {
    if (pathname !== "/search") {
      router.push("/search");
    }
  };
  return (
    <div className="bg-white max-w-md w-full z-50 absolute h-14 flex items-center">
      <div
        className="px-4 flex font-bold text-xl cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      >
        Libro
      </div>
      <div className="w-full flex justify-end items-center">
        <Input
          ref={searchRef}
          placeholder="키워드를 입력하여 도서 검색"
          className="transition duration-200 w-full m-1 text-xs"
          onClick={() => {
            handleSearchPage();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button
          type="submit"
          variant={"outline"}
          size="icon"
          className="aspect-square mr-1"
          onClick={() => {
            handleSearch();
          }}
        >
          <AiOutlineSearch size={"1.2rem"} className="justify-items-end" />
        </Button>
        <Button
          className="aspect-square mr-1 w-20 min-w-20 bg-[#9268EB] hover:bg-[#684ba6]"
          onClick={() => {
            router.push("/login");
          }}
        >
          로그인
        </Button>
      </div>
    </div>
  );
};

export default Header;
