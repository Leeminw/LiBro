import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {BookmarkIcon, FileWarningIcon, MoreHorizontalIcon} from "lucide-react";
import {StarIcon} from "@radix-ui/react-icons";

interface GroupOwner {
    profileUrl : string | null,
    nickName : string,
}

export default function Writter(props : GroupOwner) {
    const {profileUrl, nickName} = props

    return (
        <div className="flex items-center h-3/4 bg-white justify-between p-2 border rounded-md">
            <div className="flex items-center space-x-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={profileUrl || "https://github.com/shadcn.png"} alt="@defaultUser" />
                    <AvatarFallback>{nickName}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{nickName}</span>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="ml-auto w-8 h-8 rounded-full" size="icon" variant="ghost">
                        <MoreHorizontalIcon className="w-4 h-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        수정
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        삭제
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
