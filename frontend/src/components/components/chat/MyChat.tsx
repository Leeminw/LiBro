import React from 'react';
import {message} from "memfs/lib/internal/errors";

interface ChatMessageProps {
    message: string;
    inputTime: string;
}

export default function MyChat (props: ChatMessageProps)  {
    const { message, inputTime } = props;

    return (
        <div className="flex items-end justify-end space-x-2 mt-4">
            <div>
                <p className="text-xs text-gray-500 mt-1">{inputTime}</p>
            </div>
            <div>
                <div className="bg-blue-500 p-2 rounded-lg max-w-xs">
                    <p className="text-sm text-white">{message}</p>
                </div>
            </div>
        </div>
    );
}
