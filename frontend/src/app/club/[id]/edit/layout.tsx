import React from "react";
import BackBar from "@/components/layout/backbar";

export default function writePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BackBar title={"커뮤니티 수정하기"}/>
            {children}
        </>
    );
}
