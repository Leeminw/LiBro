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
  const { toast } = useToast();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    loadRecentQuery();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        target &&
        !menuRef.current?.contains(target) &&
        !searchRef.current?.contains(target) &&
        !btnRef.current?.contains(target)
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
    setSearchOpen(false);
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
          const newRecentQuery = [searchRef.current.value, ...recentQuery.slice(0, 49)];
          console.log(JSON.stringify(newRecentQuery));
          localStorage.setItem("recentQuery", JSON.stringify(newRecentQuery));
          setRecent(newRecentQuery);
        } else {
          const newRecentQuery = recent.filter(
            (element, index) => element !== searchRef.current?.value
          );
          localStorage.setItem(
            "recentQuery",
            JSON.stringify([searchRef.current?.value, ...newRecentQuery.slice(0, 49)])
          );
          setRecent([searchRef.current?.value, ...newRecentQuery.slice(0, 49)]);
        }
      } else {
        localStorage.setItem("recentQuery", JSON.stringify([searchRef.current.value]));
        setRecent([searchRef.current.value]);
      }
    } else if (isRecent) {
      if (!!localStorage.getItem("recentQuery")) {
        const newRecentQuery = recent.filter((element, index) => element !== input);
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
      localStorage.setItem("recentQuery", JSON.stringify(newRecentQuery.slice(0, 50)));
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
    <div className="max-w-md w-full z-50 flex absolute flex-col items-center">
      <div className="bg-[#9268EB] max-w-md w-full z-50 h-12 flex justify-center items-center">
        {/* Logo */}
        <div className="flex font-bold text-xl w-full justify-center text-white">
          <p
            className="w-fit pl-16 cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Libro
          </p>
        </div>
        <div className="w-20 h-12 flex justify-end items-center aspect-square" ref={btnRef}>
          {/* search button */}
          <Button
            variant={"outline"}
            size="icon"
            className={`w-full h-full pl-1 flex justify-center items-center rounded-none ${
              searchOpen ? "bg-[#7449d1]" : "bg-transparent"
            } hover:bg-[#7449d1] border-none`}
            onClick={() => {
              if (!searchOpen) searchRef.current?.focus();
              setMenuOpen(searchOpen ? false : true);
              setSearchOpen(!searchOpen);
            }}
          >
            <AiOutlineSearch size={"1.4rem"} className="justify-items-end text-white" />
          </Button>
        </div>
      </div>
      <div
        className={`w-full min-h-12 h-fit flex items-center bg-white drop-shadow-lg border border-gray-300 transition-all origin-top duration-500 absolute ease-in-out ${
          searchOpen ? "translate-y-12" : "-translate-y-1"
        }`}
      >
        <div className="w-full relative flex justify-end">
          <Input
            ref={searchRef}
            placeholder="키워드를 입력하여 도서 검색 ..."
            className="transition duration-200 w-full m-1 text-sm pl-5 pr-20 rounded-full bg-gray-100 border-gray-200"
            onClick={async (e) => {
              setMenuOpen(!menuOpen);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch("", false);
              }
            }}
          />
          <div className="absolute flex w-16 h-full justify-end items-center pr-1">
            <Button
              size={"icon"}
              className="bg-transparent text-gray-700 hover:bg-[#9268eb] hover:text-white border-l-2 border-gray-200 rounded-e-full w-full"
            >
              <AiOutlineSearch
                size={"1.4rem"}
                className="justify-items-end"
                onClick={() => {
                  handleSearch("", false);
                }}
              />
            </Button>
          </div>
          {/* recent search */}
          <div
            className={`
            absolute w-full min-h-24 h-fit bg-white drop-shadow-lg border border-gray-300 rounded-lg
            transition-all origin-top duration-300 mt-12
            ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}
            `}
            ref={menuRef}
          >
            <p className="py-3 pl-4 font-semibold text-sm truncate">최근 검색어</p>
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
                    <div className="w-full pl-4 my-auto truncate">{recent[index]}</div>
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
      </div>
    </div>
  );
};

export default Header;
