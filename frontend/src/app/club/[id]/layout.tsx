'use client'

import React, {useEffect, useState} from "react";
import {getClubMemberShip} from "@/lib/club";
import useUserState from "@/lib/login-state";
import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";

export default function writePageLayout({children, join, params}: {
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
