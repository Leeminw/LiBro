import UserProfile from "@/components/components/admin/UserProfile";

interface MemberAdminProps {
    userProfiles: UserProfile[];
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
