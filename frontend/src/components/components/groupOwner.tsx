import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"

interface GroupOwner {
    profileUrl: string | null,
    nickName: string,
}

export default function GroupOwner(props: GroupOwner) {
    const {profileUrl, nickName} = props

    return (
        <div className="flex items-center h-3/4 bg-white justify-between p-2 border rounded-md">
            <div className="flex items-center space-x-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={profileUrl || "https://github.com/shadcn.png"} alt="@defaultUser"/>
                    <AvatarFallback>{nickName}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{nickName}</span>
            </div>
        </div>
    )
}
