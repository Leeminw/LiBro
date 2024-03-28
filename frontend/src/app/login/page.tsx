"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // Next.js의 Link 컴포넌트를 사용합니다.
import { Button } from "@/components/ui/button";

const Logo = () => {
  const [loadPage, setLoadPage] = useState<boolean>(false);
  useEffect(() => {
    setLoadPage(true);
  }, []);
  return (
    <div
      className={`w-full flex flex-col max-h-80 justify-center items-center transition duration-1000 ${
        loadPage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
      }`}
      style={{ height: "300px" }}
    >
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-center text-xl font-bold">
          내게 맞는 책을 만나다.
        </h1>
        <p className="mt-2 text-center text-sm">맞춤형 도서 추천, 리뷰 앱</p>
        <h2 className="mt-8 text-5xl font-extrabold text-black">LiBro</h2>
      </div>
    </div>
  );
};
// GOOGLE_API_KEY=575331075763-mb2d05gmd3u5ddnpotu23cbr8jgo7odp.apps.googleusercontent.com;
// GOOGLE_API_SECRET_KEY=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

const GoogleLoginButton = () => {
  return (
    <Button
      className="bg-white text-black font-bold py-2 px-4 rounded flex items-center m-2 hover:bg-white transition-transform hover:scale-105 duration-200"
      style={{ width: "70%", height: "7%", border: "1px solid #D9D9D9" }}
      onClick={() => {
        window.location.href =
          "https://j10a301.p.ssafy.io/oauth2/authorization/google";
      }}
    >
      <div
        className="flex items-center border-r-2 border-gray-300 pr-3"
        style={{ height: "40px" }}
      >
        <img
          src="/google.svg"
          alt="Google"
          className="w-7 h-7 transform scale-140"
        />
      </div>
      <span className="flex-1 text-center">구글 로그인</span>
    </Button>
  );
};

const NaverLoginButton = () => {
  return (
    <Button
      onClick={() => {
        window.location.href =
          "https://j10a301.p.ssafy.io/oauth2/authorization/naver";
      }}
      className="bg-[#03C75A] text-white font-bold py-2 px-4 rounded flex items-center m-2 transition-transform hover:scale-105 duration-200"
      style={{ width: "70%", height: "7%", backgroundColor: "#03C75A" }} // 배경색 및 버튼 크기 수정
    >
      <div
        className="flex items-center border-r-2 border-white pr-3"
        style={{ height: "40px" }}
      >
        {" "}
        {/* Tailwind CSS로 오른쪽 경계선 및 패딩 추가 */}
        <img
          src="/naver.svg"
          alt="Naver"
          className="w-7 h-7 transform scale-130"
        />{" "}
        {/* Tailwind CSS로 크기 및 스케일 조정 */}
      </div>
      <span className="flex-1 text-center">네이버 로그인</span>
    </Button>
  );
};

const KakaoLoginButton = () => {
  return (
    <Button
      onClick={() => {
        window.location.href =
          "https://j10a301.p.ssafy.io/oauth2/authorization/kakao";
      }}
      className="text-black font-bold py-2 px-4 rounded flex items-center m-2 transition-transform hover:scale-105 duration-200"
      style={{ width: "70%", height: "7%", backgroundColor: "#FDE500" }} // 배경색 및 버튼 크기 수정
    >
      <div
        className="flex items-center border-r-2 border-white pr-3"
        style={{ height: "40px" }}
      >
        {" "}
        {/* Tailwind CSS로 오른쪽 경계선 및 패딩 추가 */}
        <img
          src="/kakao.svg"
          alt="Kakao"
          className="w-7 h-7 transform scale-130"
        />{" "}
        {/* Tailwind CSS로 크기 및 스케일 조정 */}
      </div>
      <span className="flex-1 text-center">카카오 로그인</span>
    </Button>
  );
};

const SocialLoginButtons = () => {
  return (
    <>
      <Logo />

      <div className="flex justify-center items-center h-50 flex-col">
        <div className="mb-3 font-bold text-sm">
          소셜 로그인으로 간편하게 가입하세요!
        </div>
        <GoogleLoginButton />
        <NaverLoginButton />
        <KakaoLoginButton />
      </div>
    </>
  );
};

export default SocialLoginButtons;
