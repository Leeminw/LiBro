'use client'

import {ChevronLeftIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import Link from "next/link";

interface HeaderProps {
    title: string;
    src?: string; // Optional src prop
}

export default function BackBar(props: HeaderProps) {
    const router = useRouter();
    const {title, src} = props;

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white text-black">
            <div className="flex items-center">
                {src ? (
                    <div className="flex items-center">
                        <Link href={src}>
                            <ChevronLeftIcon className="text-black mr-2"/>
                        </Link>
                        <div className="text-lg font-semibold">{title}</div>
                    </div>

                ) : (
                    <div className="flex items-center" onClick={handleBack}>
                        <ChevronLeftIcon className="text-black mr-2"/>
                        <div className="text-lg font-semibold">{title}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
