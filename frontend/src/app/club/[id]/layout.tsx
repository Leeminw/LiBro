import React from "react";
import BackBar from "@/components/layout/backbar";
import {Button} from "@/components/ui/button";
import {MessageCircleIcon} from "lucide-react";

export default function writePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
