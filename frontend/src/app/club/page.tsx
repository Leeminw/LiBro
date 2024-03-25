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
import {toast} from "@/components/ui/use-toast";
import {useInView} from "react-intersection-observer";

export default function ClubPage() {
    const [tabState, setTabState] = useState("my"); // Use array destructuring to get tabState and setTabState
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest'); // 초기 정렬 순서를 설정합니다. 여기서는 최신순으로 초기화합니다.

    // Define different club data for different tab states
    const myClubs: CommunityItemInform[] = [
        {
            clubName: "Chess Club",
            registeredTime: "18:00",
            clubOwner: "John Doe",
            clubId: "chess123",
        },
    ];

    const findClubs: CommunityItemInform[] = [
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

    useEffect(() => {
        toast(
            {
                title: "검색하였습니다..",
                description: `정렬순서: ${sortOrder} title: ${searchTerm}`
            }
        )
    }, [sortOrder, searchTerm]); // searchTerm도 추가합니다.

    const renderClubData = () => {
        switch (tabState) {
            case "my":
                return <FindClubCard clubs={myClubs}/>;
            case "find":
                return <FindClubCard clubs={findClubs}/>;
            default:
                return null;
        }
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            setSearchTerm(event.currentTarget.value);
        }
    };

    const handleSortChange = (event) => {
        setSortOrder(event)
    };

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            toast({
                title : "h",
                description : ""
            })

        }
    }, [inView]);

    return (

        <>
            <Tabs defaultValue={"my"} className="w-full pt-12">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="find" onClick={() => setTabState("find")}>커뮤니티 찾기</TabsTrigger>
                    <TabsTrigger value="my" onClick={() => setTabState("my")}>가입한 커뮤니티</TabsTrigger>
                </TabsList>

                {tabState === "find" && (
                    <div className="flex justify-end">
                        <Button>커뮤니티 만들기</Button>
                    </div>
                )}

                <div className="flex items-center justify-between w-2/3">
                    <Select onValueChange={handleSortChange}>
                        <SelectTrigger className={""}>
                            <SelectValue placeholder="정렬기준"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="latest">최신</SelectItem>
                                <SelectItem value="oldest">가장 오래된</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-2/3">
                    <div className="relative ">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Search" className="pl-8" onKeyDown={handleSearchKeyDown}/>
                    </div>
                </div>

                {/* Render club data based on the current tab state */}
                <TabsContent value="find">
                    <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(80vh-120px)]">
                        {tabState === "find" && renderClubData()}
                        <div ref={ref}></div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="my">
                    <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(85vh-120px)]">
                        {tabState === "my" && renderClubData()}
                        <div ref={ref}></div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>

        </>
    );
}
