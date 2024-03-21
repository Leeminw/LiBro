import React from "react";
import BackBar from "@/components/layout/backbar";

export default function writePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BackBar title={"글 작성하기"}/>
            {children}
        </>
    );
}
