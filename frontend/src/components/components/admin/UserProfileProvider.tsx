'use client';

import UserProfile from "@/components/components/admin/UserProfile";
import {useQuery} from "@tanstack/react-query"; // 수정된 import 구문
import {useParams} from "next/navigation";
import {getClubMemberList} from "@/lib/club";
import {Skeleton} from "@/components/ui/skeleton";

export default function UserProfileProvider() {
    const params = useParams();
    const clubId = parseInt(params.id as string);

    const {data, isError, isSuccess, isLoading, refetch} = useQuery<UserProfile[]>({
        queryKey: ['memberList', clubId],
        queryFn: () => getClubMemberList(clubId) // context 매개변수를 제거
    });

    if (isLoading) return <Skeleton> </Skeleton>;
    if (isError) return <>Error</>;

    return isSuccess && (
        data.map(user => (
            <UserProfile
                key={user.userId}
                profile={user.profile}
                name={user.name}
                userId={user.userId}
                role={user.role}
                createdDate={user.createdDate}
            />
        ))
    );
}
