'use client'

import React, {useRef} from 'react';
import SubHeader from "@/components/SubHeader";
import {uploadToBarcodeServer} from "@/lib/axios-fileupload";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {UploadCloudIcon} from "lucide-react";
import {useRouter} from "next/navigation";

const BarcodeReader: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleButtonClick = () => {
        fileInputRef.current && fileInputRef.current.click();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {


        const files = event.target.files;

        if (files && files.length > 0) {
            const file = event.target.files?.[0];
            if (!file) return;
            detectBarcode(file);
        } else {
            toast({
                title: "파일을 확인할 수 없습니다.",

            })
        }
    };

    const convertToFile = async (src: string) => {
        return await fetch(src)
            .then(res => res.blob())
            .then(blob => {
                return new File([blob], "image.png", {type: "image/png"})
            });
    }


    const detectBarcode = async (data: any) => {
        const formData = new FormData();
        formData.append("file", data);
        toast({
            title: "검색완료",
        })
        const res = await uploadToBarcodeServer(formData);


        if (res) {
            toast({
                title: "검색완료",
                description: res,
            })

            router.push(`/detail?isbn=${res}`);
        } else {
            toast({
                title: "조회시 아무 것도 찾을 수 없습니다.",
                description: res
            })
        }
    }

    return (
        <>
            <SubHeader title="도서 검색" backArrow={true}/>

            <div className="min-h-screen flex flex-col justify-center">
                <div className="flex items-center justify-end">
                    <Card>
                        <CardHeader>
                            <CardTitle>찾고자 하는 사진을 업로드 해주세요!</CardTitle>
                        </CardHeader>
                        <CardContent
                            className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-10 space-y-6">
                            <UploadCloudIcon className="w-16 h-16 text-zinc-500 dark:text-zinc-400"/>
                            <input
                                type="file"
                                accept="image/*"
                                id="fileInput"
                                style={{display: 'none'}}
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                            <Button
                                onClick={handleButtonClick}
                            >
                                Upload File
                            </Button>
                        </CardContent>
                    </Card>
                </div>


            </div>
        </>
    )
};

export default BarcodeReader;
