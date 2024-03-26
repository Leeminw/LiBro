import React from "react";
import {getClubMemberShip} from "@/lib/club";

export default async function writePageLayout({children, join, params}:
                                                  {
                                                      children: React.ReactNode;
                                                      join: React.ReactNode;
                                                      params: { id: number }
                                                  }) {

    const clubId = params.id;
    const clubMemberShip = await getClubMemberShip(clubId, 1);
    const isMember = clubMemberShip.role != null;

    return isMember ? (
        <>
            {children}
        </>
    ) : (
        <>
            {join}
        </>
    );

}
