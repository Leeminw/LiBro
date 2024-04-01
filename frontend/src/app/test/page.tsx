'use client'

import React, {useRef, useState} from 'react';
import {BrowserMultiFormatReader} from '@zxing/library';
import SubHeader from "@/components/SubHeader";
import {uploadToBarcodeServer, uploadToImgbb} from "@/lib/axios-fileupload";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Webcam from "react-webcam";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";

const BarcodeReader: React.FC = () => {
    const [barcodeData, setBarcodeData] = useState('');
    const codeReader = new BrowserMultiFormatReader();
    const webcamRef = useRef<Webcam>(null);
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
            console.error('파일이 선택되지 않았습니다.');
        }
    };

    const convertToFile = async (src: string) => {
        return await fetch(src)
            .then(res => res.blob())
            .then(blob => {
                return new File([blob], "image.png", {type: "image/png"})
            });
    }

    const uploadTpTempStorage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', '12905b9fdecdcaa410e1af0c87fd8efe')

        return await uploadToImgbb(formData);
    }

    const capture = React.useCallback(async () => {
        const pictureSrc = webcamRef.current!.getScreenshot({width: 1280, height: 720});

        if (pictureSrc !== null) {
            const file = await convertToFile(pictureSrc);
            const uploaded = await uploadTpTempStorage(file);
            console.log(uploaded);
            detectBarcode(file);
        }
    }, [])


    const captureImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        capture()
    };

    const detectBarcode = async (data: any) => {
        const formData = new FormData();
        formData.append("image", data);

        try {

            const fetched = await uploadToBarcodeServer(formData);
            const res = fetched.isbn;

            console.log(res);

            if (res) {
                toast({
                    title: "검색 완료",
                })

                router.push(`/detail?isbn=${res}`);
            } else {
                toast({
                    title: "조회시 아무 것도 찾을 수 없습니다.",
                })
            }
        } catch (ex) {
            toast({
                title: "조회시 아무것도 찾을 수 없습니다.",
            })
        }
    }

    return (
        <>
            <SubHeader title="도서 검색" backArrow={true}/>
            <div className="min-h-screen flex flex-col justify-center">
                <div className="flex items-center justify-end">
                    <Input
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
                </div>
                <div className="flex items-center justify-center">
                    <div className="relative bg-slate-500 w-full flex items-center justify-center h-80">
                        <div className="absolute w-2/3 h-2/3 border-4 border-white"></div>
                        <div
                            className="absolute bg-black/60 py-2 px-7 rounded-full self-end text-white mb-2 text-sm">
                            바코드를 인식시킨 후, 클릭해주세요.
                        </div>
                        <Webcam
                            style={{objectFit: "cover", width: "100%", height: "100%"}}
                            height={400}
                            ref={webcamRef}
                            width={400}
                            screenshotFormat="image/png"
                            videoConstraints={{
                                facingMode: "environment",
                                width: 1280,
                                height: 720,
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <Button onClick={captureImage}>
                        캡쳐하기
                    </Button>
                </div>
            </div>
        </>
    )
};

export default BarcodeReader;
