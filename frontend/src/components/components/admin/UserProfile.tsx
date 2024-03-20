'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import {BanIcon} from "lucide-react"
import {Toast} from "@/components/ui/toast"
import {toast} from "@/components/ui/use-toast";

interface UserProfileProps {
    profileImageUrl: string;
    userName: string;
    userNo : number,
    date: string
}

const UserProfile: React.FC<UserProfileProps> = (props) => {
    const { profileImageUrl, userNo, userName, date } = props;

    const handleBanUser = (userNo : number, e : React.MouseEvent<HTMLButtonElement>) => {
        toast({
            title: "삭제되었습니다. ",
            description: `유저명 ${userName}`,
        })
    };

    return (
        <div className="flex items-center p-4">
            <Avatar>
                <AvatarImage alt="User profile" src={profileImageUrl} />
                <AvatarFallback>{userName}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
                <span className="font-medium">{userName}</span>
                <span className="block text-sm text-gray-500">{date}</span>
            </div>
            <Button className="ml-auto" variant="ghost" onClick={(e)=>{handleBanUser(userNo, e)}}>
                <BanIcon className="w-6 h-6" />
            </Button>
        </div>
    );
};

export default UserProfile;
