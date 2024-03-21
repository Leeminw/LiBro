import React from "react";
import BackBar from "@/components/layout/backbar";

export default function writePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BackBar title={"을왕리 독서 커뮤니티"}/>
            {children}
        </>
    );
}
