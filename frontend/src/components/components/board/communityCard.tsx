import {Card, CardContent, CardTitle,CardHeader,CardFooter,CardDescription} from "@/components/ui/card";
import {CalendarIcon, MoreHorizontalIcon, SettingsIcon, XIcon, UsersIcon} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";



export default function CommunityInformCard(props : CommunityInform) {
    const { clubName, registeredTime, memberType, memberCount } = props

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 justify-between">
                    {clubName}
                    {
                        (memberType === 'ADMIN' || memberType === 'MEMBER') && <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="ml-auto w-8 h-8 rounded-full" size="icon" variant="ghost">
                                    <MoreHorizontalIcon className="w-4 h-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {memberType === 'ADMIN' && (
                                    <>
                                        <DropdownMenuItem>
                                            <SettingsIcon className="w-4 h-4 mr-2"/>
                                            커뮤니티 관리
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <SettingsIcon className="w-4 h-4 mr-2"/>
                                            게시판 관리
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <SettingsIcon className="w-4 h-4 mr-2"/>
                                            회원관리
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {memberType === 'MEMBER' && (
                                    <>
                                        <DropdownMenuItem>
                                            <XIcon className="w-4 h-4 mr-2"/>
                                            탈퇴하기
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                </CardTitle>
            </CardHeader>
            <CardContent >
                <div className="flex items-center align-top">
                    <div className="flex items-center gap-2 justify-between">
                        <CalendarIcon className="w-5 h-5"/>
                        <div className="font-bold">{registeredTime}</div>
                    </div>
                </div>
                <div className="flex items-center align-top">
                    <div className="flex items-center gap-2 justify-between">
                        <UsersIcon className="w-5 h-5"/>
                        <div className="font-bold">{memberCount}</div>
                    </div>
                </div>


            </CardContent>

        </Card>
    );
}
