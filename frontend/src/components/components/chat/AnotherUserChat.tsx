import React from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function AnotherUserChat (props: ChatMessage) {
    const {profile, name, message, createdTime} = props
    return (
            <div className="flex items-end space-x-2">
                <Avatar className="relative bottom-3">
                    <Avatar>
                        <AvatarImage alt={name} src={profile}/>
                        <AvatarFallback>{name}</AvatarFallback>
                    </Avatar>
                    <AvatarFallback>{name}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="text-xs text-gray-500">{name}</div>
                    <div className="bg-gray-200 p-2 rounded-lg max-w-xs">
                        <p className="text-sm">{message}</p>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mt-1">{createdTime}</p>
                </div>
            </div>
    );
}
