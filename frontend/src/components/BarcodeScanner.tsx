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
  const webcamRef = useRef<Webcam>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const codeReader = new BrowserMultiFormatReader();
  const capture = React.useCallback( async () => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    // const imageSrc = "testImg1.jpg";
    
    if ( imageSrc) {
      // console.log(imageSrc.length)
      const formData = new FormData()
      const byteString = atob(imageSrc.split(',')[1]);
      const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      formData.append('image' ,  blob)
      const response = await axios.post(
        'http://j10a301.p.ssafy.io:5000/flask/api/v1/isbn', formData, {
          headers:{
            'Content-Type' : 'multipart/form-data'
          }
        }  
      ).then(
        (response) => {
          const isbn = response.data
          router.push(`/detail?isbn=${isbn}`)
        }
      ).catch(
        error => {
          console.log(error)
        }
      )
      
      
    }
    
    // if (imageSrc) {
    //   codeReader
    //     .decodeFromImage(undefined, imageSrc)
    //     .then((result) => {
    //       setIsScanned(true);
    //       onUpdate(null, result);
    //     })
    //     .catch((err) => {
    //       onUpdate(err);
    //     });
    // }
  }, [codeReader, onUpdate]);

  React.useEffect(() => {
    intervalRef.current = setInterval(capture, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Webcam
      style={{ objectFit: "cover", width: "100%", height: "100%" }}
      width={width}
      height={height}
      ref={webcamRef}
      screenshotFormat="image/png"
      videoConstraints={{
        facingMode: "environment",
      }}
    />
  );
};

export default BarcodeScannerComponent;
