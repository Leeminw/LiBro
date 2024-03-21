"use client";
import { Button } from "./ui/button";
import { AiOutlineSearch } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { LoginApi } from "@/lib/axios-login";
import { useToast } from "@/components/ui/use-toast";
import useUserState from "@/lib/login-state";
const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const { deleteUserInfo } = useUserState();
  const { toast } = useToast();
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
          onMouseDown={() => {
            handleSearchPage();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button
          variant={"outline"}
          size="icon"
          className="aspect-square mr-1"
          onClick={() => {
            handleSearch();
          }}
        >
          <AiOutlineSearch size={"1.2rem"} className="justify-items-end" />
        </Button>
        {useUserState((state) => state.isLogin) ? (
          <Button
            className="aspect-square mr-1 w-20 min-w-20 bg-red-500 hover:bg-red-400"
            onClick={() => {
              const token = localStorage.getItem("accessToken");
              if (token) {
                localStorage.removeItem("id");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                deleteUserInfo();
                toast({
                  title: "로그아웃",
                  description: `정상적으로 로그아웃 되었습니다.`,
                });
                router.push("/");
              }
            }}
          >
            로그아웃
          </Button>
        ) : (
          <Button
            className="aspect-square mr-1 w-20 min-w-20 bg-[#9268EB] hover:bg-[#684ba6]"
            onClick={() => {
              router.push("/login");
            }}
          >
            로그인
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
