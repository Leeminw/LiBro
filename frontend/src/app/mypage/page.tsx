'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@radix-ui/react-progress"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

interface User {
    profileUrl: string | null,
    id: string,
    nickName: string,
    name: string,
    birth: string
    readRate: number,
    bookRate: number,
}

const Mypage = (props: User) => {

  const {profileUrl, nickName, id, name, birth} = props // user
  const [readRate, setReadRate] = useState(0) // 완독수
  const [bookRate, setBookRate] = useState(0) // 책 평점
  
  // 완독한 책의 수와 총 책의 수 예시
  const finishedBooks = 10; // 완독한 책의 수
  const totalBooks = 20; // 총 책의 수

  useEffect(() => {
    // 완독율 계산 후 상태 업데이트
    const newReadRate = (finishedBooks / totalBooks) * 100;
    setReadRate(newReadRate);
  }, [finishedBooks, totalBooks]); // finishedBooks 또는 totalBooks가 변경될 때마다 실행

  return (
    <div className="bg-white h-full">
      <div className="p-4">

        <div className="mb-2 pb-2 border-b border-gray-300">
            <div className="text-xl font-bold ml-2 ">마이페이지</div>
        </div>

        <div className="">
            <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">내 정보</TabsTrigger>
                <TabsTrigger value="password">나의 독서기록</TabsTrigger>
            </TabsList>
            </Tabs>
        </div>

        <div className="mt-4 pb-3 flex w-full border-b border-gray-300">
            <div className="w-1/3 flex justify-center items-center">
                <div>
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={profileUrl || "https://github.com/shadcn.png"} alt="@defaultUser"/>
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <Button className="mt-4 bg-[#9268EB] text-white font-bold" variant="secondary">
                        프로필 수정
                    </Button>
                </div>
            </div>
            <div className="w-2/3 justify-center mt-2">
                <div className="mb-6 grid grid-cols-12 gap-4 pl-2">
                    <div className="text-sm text-gray-500 font-bold col-span-4 ">계정</div>
                    <div className="text-sm text-gray-500 col-span-8">{id}11</div>
                </div>
                <div className="mb-6 grid grid-cols-12 gap-4 pl-2">
                    <div className="text-sm text-gray-500 font-bold col-span-4">닉네임</div>
                    <div className="text-sm text-gray-500 col-span-8">{nickName}22</div>
                </div>
                <div className="mb-6 grid grid-cols-12 gap-4 pl-2" >
                    <div className="text-sm text-gray-500 font-bold col-span-4">이름</div>
                    <div className="text-sm text-gray-500 col-span-8">{name}33</div>
                </div>
                <div className="mb-1 grid grid-cols-12 gap-4 pl-2">
                    <div className="text-sm text-gray-500 font-bold col-span-4">생년월일</div>
                    <div className="text-sm text-gray-500 col-span-8">{birth}44</div>
                </div>
            </div>
        </div>

        <div className="flex flex-col">
            <div className="mt-4">
                <div className="text-xl font-bold ml-2 mr-2">분석</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center mt-3 mb-3 pb-3 pt-3 border-b border-t border-gray-300">
                <div className="flex flex-row items-center justify-center space-x-2 col-span-1">
                    <div className="text-sm font-bold">담은 책 수</div>
                    <div className="text-xs">231</div>
                </div>
                <div className="flex flex-row items-center justify-center space-x-2 col-span-1 border-l border-r border-gray-300">
                    <div className="text-sm font-bold">책 완독 수</div>
                    <div className="text-xs">231</div>
                </div>
                <div className="flex flex-row items-center justify-center space-x-2 col-span-1">
                    <div className="text-sm font-bold">기록 글귀 수</div>
                    <div className="text-xs">231</div>
                </div>
            </div>
        </div>

        <div className="ml-2 mr-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">완독율</div>
            <div className="text-sm font-bold text-gray-500">{readRate}%</div>
          </div>
          <Progress className="w-full h-2 bg-[#9268EB] rounded" value={readRate} />
        </div>

        <div className="ml-2 mr-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">나의 평균 평점</div>
            <div className="flex items-center">
              <div className="mr-2 text-m font-bold">4.7</div>
              <StarFillIcon className="text-[#FFCA28] w-8 h-8" />
              <StarFillIcon className="text-[#FFCA28] w-8 h-8" />
              <StarFillIcon className="text-[#FFCA28] w-8 h-8" />
              <StarFillIcon className="text-[#FFCA28] w-8 h-8" />
              <StarEmptyIcon className="text-[#E5E7EB] w-8 h-8" />
              
            </div>
            <div className="flex">
                <Button variant="ghost">남긴 리뷰 수</Button>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base">5</div>
              <StarFillIcon className="text-[#FFCA28] w-4 h-4" />
              <Progress className="w-5/6 h-1.5 bg-[#FFCA28] rounded" value={65} />
              <div className="text-sm">65%</div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-base">4</div>
              <StarFillIcon className="text-[#FFCA28] w-4 h-4" />
              <Progress className="w-5/6 h-1.5 bg-[#FFCA28] rounded" value={65} />
              <div className="text-sm">65%</div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-base">3</div>
              <StarFillIcon className="text-[#FFCA28] w-4 h-4" />
              <Progress className="w-5/6 h-1.5 bg-[#FFCA28] rounded" value={65} />
              <div className="text-sm">65%</div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-base">2</div>
              <StarFillIcon className="text-[#FFCA28] w-4 h-4" />
              <Progress className="w-5/6 h-1.5 bg-[#FFCA28] rounded" value={65} />
              <div className="text-sm">65%</div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-base">1</div>
              <StarFillIcon className="text-[#FFCA28] w-4 h-4" />
              <Progress className="w-5/6 h-1.5 bg-[#FFCA28] rounded" value={65} />
              <div className="text-sm">65%</div>
            </div>

          
            <ChevronRightIcon className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-white py-4">

      </div>
    </div>
  )
}

export default Mypage

function ChevronRightIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function StarFillIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#FFCA28"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function StarEmptyIcon(props : any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#E5E7EB"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }