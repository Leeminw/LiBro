/**
 * v0 by Vercel.
 * @see https://v0.dev/t/grRWZs7f1oa
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {Input} from "@/components/ui/input"
import {ScrollArea} from "@/components/ui/scroll-area"
import MyChat from "@/components/components/chat/MyChat";
import AnotherUserChat from "@/components/components/chat/AnotherUserChat";
import {SendIcon} from "lucide-react"

export default function Component() {
    return (
        <>
            <ScrollArea className="flex flex-col max-w-md mx-auto bg-white h-[calc(90vh-120px)]">
                <div className="p-3 space-y-2">
                    <MyChat message={"message"} createdTime={"19:28 AM"} name={"김치맨"} profile={""}/>
                    <AnotherUserChat profile={""} name={"김치맨"} message={"김치 많이 먹어라"} createdTime={"19 29 PM"}/>
                </div>
            </ScrollArea>
            <div className="bg-white sticky bottom-24 flex items-center justify-between">
                <Input className="flex-1" placeholder="Type a message..." type="text"/>
                <SendIcon className="text-gray-600 ml-3 relative right-1"/>
            </div>
        </>
    )
}

