import React from 'react';


export default function MyChat(props: ChatMessage) {
    const {profile, name, message, createdTime} = props;

    return (
        <div className="flex items-end justify-end space-x-2 mt-4">
            <div>
                <p className="text-xs text-gray-500 mt-1">{createdTime}</p>
            </div>
            <div>
                <div className="bg-blue-500 p-2 rounded-lg max-w-xs">
                    <p className="text-sm text-white">{message}</p>
                </div>
            </div>
        </div>
    );
}
