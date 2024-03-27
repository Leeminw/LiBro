"use client";
import { Button } from "./ui/button";
import { AiOutlineSearch } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { LoginApi } from "@/lib/axios-login";
import { useToast } from "@/components/ui/use-toast";
import useUserState from "@/lib/login-state";
const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { userInfo, deleteUserInfo } = useUserState();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(false);
  const [loginLoad, setLoginLoad] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const loadLogin = () => {
    setIsLogin(!!localStorage.getItem("accessToken"));
    setLoginLoad(true);
    if (!!localStorage.getItem("accessToken")) {
      LoginApi.verifyToken()
        .then(() => {})
        .catch(() => {
          deleteUserInfo();
          loadLogin();
          router.replace("/");
          toast({
            title: "세션이 만료됨",
            description: `세션이 만료되어 로그아웃 되었습니다.\n 다시 로그인해주세요.`,
          });
        });
    }
  };

  useEffect(() => {
    loadLogin();
  }, [userInfo]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (target && !menuRef.current?.contains(target) && !searchRef.current?.contains(target)) {
        console.log("close menu");
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSearch = () => {
    if (searchRef.current) {
      router.push(`/search/result?query=${searchRef.current.value}&start=1`);
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
        <div className="w-full flex justify-end items-center ">
          <div className="w-full flex relative">
            <Input
              ref={searchRef}
              placeholder="키워드를 입력하여 도서 검색"
              className="transition duration-200 w-full m-1 text-xs"
              onMouseDown={async (e) => {
                setMenuOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <div
              className={`
            absolute w-full min-h-24 h-fit bg-white drop-shadow-lg border border-gray-300 rounded-lg mt-12
            transition-all origin-top duration-300
            ${menuOpen ? "opacity-100 scale-y-100 scale-x-100" : "opacity-0 scale-y-50 scale-x-75"}
            `}
              ref={menuRef}
            >
              <p className="py-3 pl-4 font-semibold text-sm">최근 검색어</p>
              <hr />
              <div className="w-full px-1">
                <div className="flex w-full py-2 rounded-lg my-1 hover:bg-gray-300 transition duration-200 cursor-pointer text-sm relative">
                  <p className="w-5/6 pl-4 line-clamp-1">안녕</p>
                  <div className="w-1/6 px-2 justify-end"></div>
                </div>
              </div>
            </div>
          </div>
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
        </div>

        {loginLoad ? (
          isLogin ? (
            <Button
              className="aspect-square mr-1 w-20 min-w-20 bg-gray-400 hover:bg-gray-300"
              onClick={() => {
                deleteUserInfo();
                loadLogin();
                router.push("/");
                toast({
                  title: "로그아웃",
                  description: `정상적으로 로그아웃 되었습니다.`,
                });
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
          )
        ) : (
          <div className="mr-1 w-20 min-w-20"></div>
        )}
      </div>
    </div>
  );
};

export default Header;
