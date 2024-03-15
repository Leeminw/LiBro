import UserProfile from "@/components/components/admin/UserProfile";
import {ScrollArea} from "@/components/ui/scroll-area";
import UserProfileProvider from "@/components/components/admin/UserProfileProvider";

interface UserProfileProps {
    profileImageUrl: string;
    userName: string;
    userNo: number;
    date: string;
}

export default function MemberAdminPage() {


    const dummyUserProfiles: UserProfileProps[] = [
        { profileImageUrl: "", userName: "김사랑", userNo: 112, date: "2024-12-13" },
        { profileImageUrl: "", userName: "김소망", userNo: 113, date: "2024-12-13" },
        { profileImageUrl: "", userName: "김희망", userNo: 114, date: "2024-12-13" },
        { profileImageUrl: "", userName: "김행복", userNo: 115, date: "2024-12-13" },
        { profileImageUrl: "", userName: "김부각", userNo: 116, date: "2024-12-13" },
    ];


    return (
        <div className="flex flex-col bg-white">
            <div className="flex justify-between px-4 py-2">
                <span className="font-bold text-xl ">전체 유저</span>
            </div>

            <ScrollArea className="flex flex-col max-w-md bg-white h-[calc(90vh-100px)]">
                <UserProfileProvider userProfiles={dummyUserProfiles}/>
            </ScrollArea>
        </div>
    )
}
