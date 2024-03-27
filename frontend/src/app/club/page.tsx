'use client'

import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import React, {useState} from "react";
import JoinedClubCard from "@/components/components/club/JoinedClubCard";
import ClubListCard from "@/components/components/club/ClubListCard";
import Link from "next/link";
import useUserState from "@/lib/login-state";

export default function ClubPage() {
    const [tabState, setTabState] = useState("find"); // Use array destructuring to get tabState and setTabState
    const {getUserInfo} = useUserState();
    const userId = getUserInfo().id;
    const isMember = userId !== 0;

    const renderClubData = () => {
        switch (tabState) {
            case "my":
                return <JoinedClubCard/>;
            case "find":
                return <ClubListCard/>;
            default:
                return null;
        }
    };

    return (
        <>
            <Tabs defaultValue={"find"} className="w-full pt-12">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="find" onClick={() => setTabState("find")}>커뮤니티 찾기</TabsTrigger>
                    <TabsTrigger value="my" onClick={() => setTabState("my")}>가입한 커뮤니티</TabsTrigger>
                </TabsList>

                <TabsContent value="find">
                    {tabState === "find" && renderClubData()}
                </TabsContent>
                <TabsContent value="my">
                    {tabState === "my" && renderClubData()}
                </TabsContent>
            </Tabs>
        </>
    )
        ;
}
