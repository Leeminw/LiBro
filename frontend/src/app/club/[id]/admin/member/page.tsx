import {ScrollArea} from "@/components/ui/scroll-area";
import UserProfileProvider from "@/components/components/admin/UserProfileProvider";
import SubHeader from "@/components/SubHeader";
import React from "react";

interface UserProfileProps {
    profileImageUrl: string;
    userName: string;
    userNo: number;
    date: string;
}

export default function MemberAdminPage() {

    return (
        <>
            <SubHeader title="회원 관리" backArrow={true}/>
            <div className="pt-24"/>
            <div className="flex flex-col bg-white">
                <div className="flex justify-between px-4 pt-6">
                    <span className="font-bold text-xl ">전체 유저</span>
                </div>

                <ScrollArea className="flex flex-col max-w-md bg-white h-[calc(90vh-100px)]">
                    <UserProfileProvider/>
                </ScrollArea>
            </div>
        </>

    )
}
