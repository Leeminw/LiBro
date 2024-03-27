'use client'

import React from "react";
import {getClubMemberShip} from "@/lib/club";
import useUserState from "@/lib/login-state";
import {useQuery} from "@tanstack/react-query";

export default function Layout({children, join, params}: {
    children: React.ReactNode;
    join: React.ReactNode;
    params: { id: number }
}) {


    const clubId = params.id;
    const {id: userId} = useUserState().getUserInfo();

    const {data, isLoading, isError, isSuccess} = useQuery({
        queryFn: () => getClubMemberShip(clubId, userId),
        queryKey: ['memberShip', clubId, userId]
    });


    if (isLoading) return null;
    if (isError) return null;
    if (isSuccess) return !data.role ? <>{join}</> : <>{children}</>;
}
