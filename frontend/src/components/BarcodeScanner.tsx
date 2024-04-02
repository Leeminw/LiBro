"use client";
import React, { useRef } from "react";
import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  EAN13Reader,
  Result,
} from "@zxing/library";
import Webcam from "react-webcam";
import instance from "@/lib/interceptor"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
const BarcodeScannerComponent = ({
  width,
  height,
  onUpdate,
}: {
  width: number;
  height: number;
  onUpdate: (arg0: unknown, arg1?: Result) => void;
}): React.ReactElement => {
  const [isScanned, setIsScanned] = React.useState<boolean>(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string|null>(null) 
  const [isbn, setIsbn] = useState<String|null>(null)
  const webcamRef = useRef<Webcam>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const codeReader = new BrowserMultiFormatReader();
  
  const capture = React.useCallback( async () => {


    const video = videoRef.current;
    const canvas = document.createElement('canvas')
    
    if(video){
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      console.log(canvas)
      const context = canvas.getContext('2d')
      if(context){
        canvas.width = video.videoWidth * 0.6; // 가로는 중앙의 60%
        canvas.height = video.videoHeight * 0.5; // 세로는 중앙의 50%
    
        // 이미지를 잘라내기 위한 좌표 계산
        const sourceX = (video.videoWidth - canvas.width) / 2; // 가로 중앙
        const sourceY = (video.videoHeight - canvas.height) / 2; // 세로 중앙
        const sourceWidth = canvas.width;
        const sourceHeight = canvas.height;
        const destX = 0;
        const destY = 0;
        const destWidth = canvas.width;
        const destHeight = canvas.height;
    
        // 비디오 프레임을 캔버스에 그리고, 일부분을 잘라냅니다.
        context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        
        // 잘라낸 이미지를 데이터 URL로 변환하여 상태에 저장합니다.
        const image = canvas.toDataURL('image/png');
        try {

          const codeResult = await codeReader.decodeFromImage(undefined, image);
          if (codeResult && codeResult.getText()) {
            setIsbn(codeResult.getText());
          }
        }
        catch(error) {
          
        }
        // console.log(codeResult.getText())
        // console.log(image)
        setPhoto(image);
      }
      
    }

  }, [codeReader, onUpdate]);

  React.useEffect(() => {
    intervalRef.current = setInterval(capture, 1000);
    const video = videoRef.current;
    if (video) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
          video.play();
        })
        .catch(error => console.error('Error accessing camera:', error));
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '100%', height: '100%' }} />
      <div>여기 결과 페이지 isbn :{ isbn ? isbn : "못 읽음"}</div>
  </div>
  );
};

export default BarcodeScannerComponent;
