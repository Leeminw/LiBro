'use client'

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
    profileUrl: string;
    id: string;
    nickName: string;
    name: string;
    birth: string;
}

const Mypage = () => {

  // const {profileUrl, nickName, id, name, birth} = user;
  const profileUrl = "";
  const nickName = "";
  const id = "";
  const name = "";
  const birth = "";

  return (
    <div className="bg-white h-full">
      <div className="p-4">
        <div className="text-xl font-bold mb-2">마이페이지</div>
        <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">내 정보</TabsTrigger>
            <TabsTrigger value="password">나의 독서기록</TabsTrigger>
        </TabsList>
        </Tabs>
        <div className="mt-4 flex w-full">
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
                <div className="flex mb-6 ">
                    <div className="text-sm text-gray-500 font-bold">계정</div>
                    <div className="text-sm text-gray-500">{id}11</div>
                </div>
                <div className="flex mb-6">
                    <div className="text-sm text-gray-500 font-bold">닉네임</div>
                    <div className="text-sm text-gray-500">{nickName}22</div>
                </div>
                <div className="flex mb-6">
                    <div className="text-sm text-gray-500 font-bold">이름</div>
                    <div className="text-sm text-gray-500">{name}33</div>
                </div>
                <div className="flex mb-1">
                    <div className="text-sm text-gray-500 font-bold">생년월일</div>
                    <div className="text-sm text-gray-500">{birth}44</div>
                </div>
            </div>
        </div>
        <div className="mt-8 flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold">231</div>
            <div className="text-sm">보유 쿠폰</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">115</div>
            <div className="text-sm">완독 수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">115</div>
            <div className="text-sm">기록한 글귀 수</div>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">완독률</div>
            <div className="text-lg font-bold text-gray-500">50%</div>
          </div>
          <Progress className="w-full mt-2" value={50} />
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">나의 평점 평균</div>
            <div className="flex items-center">
              <StarIcon className="text-yellow-400 " />
              <StarIcon className="text-yellow-400" />
              <StarIcon className="text-yellow-400" />
              <StarIcon className="text-yellow-400" />
              <StarIcon className="text-gray-300" />
              <div className="ml-2 text-lg font-bold">4.7</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-base">5 별점</div>
              <Progress className="w-3/4 h-1 bg-yellow-400" value={65} />
              <div className="text-base">65%</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-base">4 별점</div>
              <Progress className="w-3/4 h-1 bg-yellow-400" value={10} />
              <div className="text-base">10%</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-base">3 별점</div>
              <Progress className="w-3/4 h-1 bg-yellow-400" value={25} />
              <div className="text-base">25%</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-base">2 별점</div>
              <Progress className="w-3/4 h-1 bg-yellow-400" value={0} />
              <div className="text-base">0%</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-base">1 별점</div>
              <Progress className="w-3/4 h-1 bg-yellow-400" value={0} />
              <div className="text-base">0%</div>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost">리뷰 쓰기</Button>
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

function StarIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="yellow"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}