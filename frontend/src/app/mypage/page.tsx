"use client";

import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Myinfo from "../../components/components/mypage/mypage";
import Calendar from "../../components/components/mypage/calendarV2";
import { useRouter } from "next/navigation";
import { LoginApi } from "@/lib/axios-login";
import { Button } from "@/components/ui/button";
import useUserState from "@/lib/login-state";
import { useToast } from "@/components/ui/use-toast";

const Mypage = () => {
  const router = useRouter();
  const { deleteUserInfo } = useUserState();
  const { toast } = useToast();
  useEffect(() => {
    LoginApi.verifyToken()
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
        router.push("/login");
      });
  }, []);

  return (
    <div className="bg-white h-full overflow-auto pb-24 max-h-[90vh]">
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
  );
};

export default Mypage;
