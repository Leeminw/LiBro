import UserProfile from "@/components/components/admin/UserProfile";

interface UserProfileProps {
    profileImageUrl: string;
    userName: string;
    userNo: number;
    date: string;
}

interface MemberAdminProps {
    userProfiles: UserProfileProps[];
}

export default function UserProfileProvider(props : MemberAdminProps) {
    const {userProfiles} = props
    return (
        userProfiles.map(user  => (
                <UserProfile
                    key={user.userNo}
                    profileImageUrl={user.profileImageUrl}
                    userName={user.userName}
                    userNo={user.userNo}
                    date={user.date}
                />
            ))
    )
}
