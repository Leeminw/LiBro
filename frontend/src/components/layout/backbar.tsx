'use client'

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation"


interface HeaderProps {
    title: string;
}

export default function BackBar(props: HeaderProps) {
    const router = useRouter();
    const {title} = props;

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white text-black">
            <div className="flex items-center">
                <ChevronLeftIcon className="text-black mr-2" onClick={handleBack} />
                <div className="text-lg font-semibold">{title}</div>
            </div>
        </div>
    );
}
