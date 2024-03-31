"use client";
import { BiBarcode } from "react-icons/bi";
import { IoMdHome } from "react-icons/io";
import { IoLibrary } from "react-icons/io5";
import { BsFillPersonFill, BsFillPeopleFill } from "react-icons/bs";
import Link from "next/link";
import { useEffect, useState } from "react";
import useUserState from "@/lib/login-state";
import { LoginApi } from "@/lib/axios-login";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
const BottomNavigation = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { userInfo, deleteUserInfo } = useUserState();
  const [isLogin, setIsLogin] = useState(false);
  const [loginLoad, setLoginLoad] = useState(false);
  const loadLogin = () => {
    setIsLogin(!!localStorage.getItem("accessToken"));
    setLoginLoad(true);
    console.log("profile", userInfo.profile);
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
  });
  return (
    <div className="fixed z-50 w-full h-16 max-w-md -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-0 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto select-none">
        <button
          type="button"
          className="rounded-s-full hover:bg-gray-100 dark:hover:bg-gray-800 group transition duration-300"
        >
          <Link
            href={{
              pathname: "/",
            }}
            className="w-full h-full inline-flex flex-col items-center justify-end rounded-s-full pb-1"
          >
            <IoMdHome
              aria-hidden="true"
              size={"2rem"}
              className="text-gray-500 dark:text-gray-400 group-hover:text-[#9268EB] dark:group-hover:text-[#9268EB] transition duration-300"
            />
            <span className="text-[0.7rem] overflow-hidden text-nowrap">홈</span>
          </Link>
        </button>
        <button
          type="button"
          className="hover:bg-gray-100 dark:hover:bg-gray-800 group transition duration-300"
        >
          <Link
            href={{
              pathname: "/club",
            }}
            className="w-full h-full inline-flex flex-col items-center justify-end pb-1"
          >
            <BsFillPeopleFill
              aria-hidden="true"
              size={"2rem"}
              className="text-gray-500 dark:text-gray-400 group-hover:text-[#9268EB] dark:group-hover:text-[#9268EB] transition duration-300"
            />
            <span className="text-[0.7rem] overflow-hidden text-nowrap">커뮤니티</span>
          </Link>
        </button>
        <div className="flex flex-col items-center justify-end dark:text-gray-400 pb-1">
          <button
            type="button"
            className="inline-flex flex-col items-center mt-[-2rem] mb-[0.3rem] aspect-square justify-center w-14 h-14 font-medium bg-[#9268EB] rounded-full hover:bg-[#bfa1ff] group text-white transition duration-300"
          >
            <Link
              href={{
                pathname: "/scan",
              }}
              className="m-0"
            >
              <BiBarcode aria-hidden="true" size={"2.25rem"} style={{ color: "white" }} />
            </Link>
          </button>
          <span className="text-[0.7rem] overflow-hidden text-nowrap cursor-default">
            바코드 스캔
          </span>
        </div>

        <button
          type="button"
          className=" hover:bg-gray-100 dark:hover:bg-gray-800 group transition duration-300"
        >
          <Link
            href={{
              pathname: loginLoad && isLogin ? "/library" : "/login",
            }}
            className="w-full h-full inline-flex flex-col items-center justify-end pb-1"
          >
            <IoLibrary
              aria-hidden="true"
              size={"2.2rem"}
              className="text-gray-500 dark:text-gray-400 group-hover:text-[#9268EB] dark:group-hover:text-[#9268EB] transition duration-300"
            />
            <span className="text-[0.7rem] overflow-hidden text-nowrap">나의 서재</span>
          </Link>
        </button>
        {loginLoad && isLogin ? (
          <button
            type="button"
            className="rounded-e-full hover:bg-gray-100 dark:hover:bg-gray-800 group transition duration-300"
          >
            <Link
              href={{
                pathname: "/mypage",
              }}
              className="rounded-e-full w-full h-full inline-flex flex-col items-center justify-end pb-1"
            >
              <Avatar className="w-9 h-9 mb-0.5">
                <AvatarImage src={userInfo.profile} />
              </Avatar>
              <span className="text-[0.7rem] overflow-hidden text-nowrap">마이페이지</span>
            </Link>
          </button>
        ) : (
          <button
            type="button"
            className="rounded-e-full hover:bg-gray-100 dark:hover:bg-gray-800 group transition duration-300"
          >
            <Link
              href={{
                pathname: "/login",
              }}
              className="rounded-e-full w-full h-full inline-flex flex-col items-center justify-end pb-1"
            >
              <BsFillPersonFill
                aria-hidden="true"
                size={"2rem"}
                className="text-gray-500 dark:text-gray-400 group-hover:text-[#9268EB] dark:group-hover:text-[#9268EB] transition duration-300"
              />
              <span className="text-[0.7rem] overflow-hidden text-nowrap">로그인</span>
            </Link>
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
