"use client";
import { Button } from "./ui/button";
import { AiOutlineSearch } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { LoginApi } from "@/lib/axios-login";
import { useToast } from "@/components/ui/use-toast";
import useUserState from "@/lib/login-state";
import { AiOutlineClose } from "react-icons/ai";
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
  const [recent, setRecent] = useState<string[]>([]);
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
    loadRecentQuery();
    loadLogin();
  }, [userInfo]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        target &&
        !menuRef.current?.contains(target) &&
        !searchRef.current?.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSearch = (input: string, isRecent: boolean) => {
    setMenuOpen(false);
    if (!isRecent && searchRef.current) {
      saveRecentQuery("", false);
      const url = `/search/result?query=${searchRef.current.value}&start=1`;
      if (pathname !== "/search/result") {
        router.push(url);
      } else {
        window.location.href = url;
      }
    } else if (isRecent) {
      saveRecentQuery(input, true);
      const url = `/search/result?query=${input}&start=1`;
      if (pathname !== "/search/result") {
        router.push(url);
      } else {
        window.location.href = url;
      }
    }
  };

  const saveRecentQuery = (input: string, isRecent: boolean) => {
    if (!isRecent && searchRef.current) {
      if (!!localStorage.getItem("recentQuery")) {
        const jsonQuery = localStorage.getItem("recentQuery");
        const recentQuery: string[] = jsonQuery ? JSON.parse(jsonQuery) : [];
        if (!recentQuery.includes(searchRef.current.value)) {
          const newRecentQuery = [
            searchRef.current.value,
            ...recentQuery.slice(0, 49),
          ];
          console.log(JSON.stringify(newRecentQuery));
          localStorage.setItem("recentQuery", JSON.stringify(newRecentQuery));
          setRecent(newRecentQuery);
        } else {
          const newRecentQuery = recent.filter(
            (element, index) => element !== searchRef.current?.value
          );
          localStorage.setItem(
            "recentQuery",
            JSON.stringify([
              searchRef.current?.value,
              ...newRecentQuery.slice(0, 49),
            ])
          );
          setRecent([searchRef.current?.value, ...newRecentQuery.slice(0, 49)]);
        }
      } else {
        localStorage.setItem(
          "recentQuery",
          JSON.stringify([searchRef.current.value])
        );
        setRecent([searchRef.current.value]);
      }
    } else if (isRecent) {
      if (!!localStorage.getItem("recentQuery")) {
        const newRecentQuery = recent.filter(
          (element, index) => element !== input
        );
        localStorage.setItem(
          "recentQuery",
          JSON.stringify([input, ...newRecentQuery.slice(0, 49)])
        );
        setRecent([input, ...newRecentQuery.slice(0, 49)]);
      }
    }
  };

  const deleteRecentQuery = (idx: number) => {
    if (!!localStorage.getItem("recentQuery")) {
      const newRecentQuery = recent.filter((element, index) => index !== idx);
      localStorage.setItem(
        "recentQuery",
        JSON.stringify(newRecentQuery.slice(0, 50))
      );
      setRecent(newRecentQuery);
    }
  };

  const loadRecentQuery = () => {
    if (!!localStorage.getItem("recentQuery")) {
      const jsonQuery = localStorage.getItem("recentQuery");
      const recentQuery: string[] = jsonQuery ? JSON.parse(jsonQuery) : [];
      setRecent(recentQuery);
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
              onFocus={async (e) => {
                setMenuOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch("", false);
                }
              }}
            />
            <div
              className={`
            absolute w-full min-h-24 h-fit bg-white drop-shadow-lg border border-gray-300 rounded-lg mt-12
            transition-all origin-top duration-300
            ${
              menuOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-0"
            }
            `}
              ref={menuRef}
            >
              <p className="py-3 pl-4 font-semibold text-sm truncate">
                최근 검색어
              </p>
              <hr />
              <div className="w-full px-1 mt-1">
                {recent.length === 0 ? (
                  <div className="flex w-full h-10 rounded-lg my-0.5 transition duration-200 select-none text-sm truncate">
                    <div className="w-full pl-4 my-auto truncate text-xs text-gray-400">
                      최근에 검색한 기록이 없습니다.
                    </div>
                  </div>
                ) : (
                  recent.slice(0, 5).map((key, index) => (
                    <div
                      key={key}
                      onClick={() => {
                        if (searchRef.current) {
                          searchRef.current.value = key;
                          handleSearch(searchRef.current.value, true);
                        }
                      }}
                      className="flex w-full h-10 rounded-lg my-0.5 hover:bg-gray-100 transition duration-200 cursor-pointer text-sm truncate"
                    >
                      <div className="w-5/6 pl-4 my-auto truncate">
                        {recent[index]}
                      </div>
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteRecentQuery(index);
                        }}
                        className="w-fit m-2 flex justify-center items-center hover:bg-gray-300 rounded-full transition aspect-square"
                      >
                        <AiOutlineClose className=" transition-color duration-300" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <Button
            variant={"outline"}
            size="icon"
            className="aspect-square mr-1"
            onClick={() => {
              handleSearch("", false);
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
