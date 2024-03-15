'use client'

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {Badge, Search} from "lucide-react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {useEffect, useState} from "react";
import FindClubCard from "@/components/components/club/FindClubCard2";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function ClubPage() {
    const [tabState, setTabState] = useState("my"); // Use array destructuring to get tabState and setTabState

    // Define different club data for different tab states
    const myClubs : CommunityItemInform[] = [
        {
            clubName: "Chess Club",
            registeredTime: "18:00",
            clubOwner: "John Doe",
            clubId: "chess123",
        },
    ];

    const findClubs : CommunityItemInform[] = [
        {
            clubName: "Chess Club",
            registeredTime: "18:00",
            clubOwner: "John Doe",
            clubId: "chess123",
        },
        {
            clubName: "Chess Club",
            registeredTime: "18:00",
            clubOwner: "John Doe",
            clubId: "chess123",
        },
        {
            clubName: "Chess Club",
            registeredTime: "18:00",
            clubOwner: "John Doe",
            clubId: "chess123",
        },
        {
            clubName: "Chess Club",
            registeredTime: "18:00",
            clubOwner: "John Doe",
            clubId: "chess123",
        },

    ];

    // Define a function to render club data based on the current tab state
    const renderClubData = () => {
        switch (tabState) {
            case "my":
                return <FindClubCard clubs={myClubs} />;
            case "find":
                return <FindClubCard clubs={findClubs} />;
            default:
                return null;
        }
    };

    return (
        <>
                <Tabs defaultValue={"my"} className="w-full pt-12">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="find" onClick={() => setTabState("find")}>커뮤니티 찾기</TabsTrigger>
                        <TabsTrigger value="my" onClick={() => setTabState("my")}>가입한 커뮤니티</TabsTrigger>
                    </TabsList>

                    <div className="flex justify-end">
                        <Button>가입하기 </Button>
                    </div>

                    <div className="flex items-center justify-between w-2/3">
                        <Select>
                            <SelectTrigger className={""}>
                                <SelectValue placeholder="정렬기준"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="apple">최신</SelectItem>
                                    <SelectItem value="banana">가장 오래된</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-2/3">
                        <div className="relative ">
                            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground"/>
                            <Input placeholder="Search" className="pl-8"/>
                        </div>
                    </div>

                    {/* Render club data based on the current tab state */}
                    <TabsContent value="find">
                        <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(80vh-120px)]">
                            {tabState === "find" && renderClubData()}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="my">
                        <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(85vh-120px)]">
                            {tabState === "my" && renderClubData()}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>

        </>
    );
}
