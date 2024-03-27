'use client'

import React from "react"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import Myinfo from './mypage/page'
import Calendar from './mypage/page'


const Mypage = () => {
  
  return (
    <div className="bg-white h-full pt-12 overflow-auto">
      <div className="p-4">

        <div className="mb-2 pb-2 ">
            <div className="text-xl font-bold ml-2 ">마이페이지</div>
        </div>

        <Tabs defaultValue="mypage" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mypage">내 정보</TabsTrigger>
              <TabsTrigger value="calendar">나의 독서기록</TabsTrigger>
          </TabsList>
          <TabsContent value="mypage">
            <Myinfo></Myinfo>
          </TabsContent>

          <TabsContent value="calendar">
            <Calendar></Calendar>
          </TabsContent>
          </Tabs>

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