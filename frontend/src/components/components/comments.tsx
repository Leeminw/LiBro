/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Jd3OFwX
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface ReplyUser {
    profileUrl : string | null,
    nickName : string,
    registeredAt : string,
    contents : string,
}

export default function Comments(props : ReplyUser) {

    const {profileUrl, nickName, registeredAt, contents} = props

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mx-auto my-2">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="flex space-x-4">
                    <div>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={profileUrl || "https://github.com/shadcn.png"} alt="@defaultUser" />
                            <AvatarFallback>{nickName}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div className="text-lg font-bold dark:text-white">{nickName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-200">{registeredAt}</div>
                    </div>
                </div>
                <div>
                    <Select>
                        <SelectTrigger aria-label="Options">
                            <svg
                                className=" w-6 h-6 text-gray-500 dark:text-gray-200"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                            </svg>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="delete">삭제</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="px-6 py-4">
                <div className="text-sm text-gray-800 dark:text-gray-200">
                    {contents}
                </div>
            </div>
        </div>
    )
}

