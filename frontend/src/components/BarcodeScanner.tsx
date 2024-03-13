"use client";
import React, { useRef } from 'react'
import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType, EAN13Reader, Result } from '@zxing/library'
import Webcam from 'react-webcam'

const BarcodeScannerComponent = ({
  width,
  height,
  onUpdate
}: {
  width: number;
  height: number;
  onUpdate: (arg0: unknown, arg1?: Result) => void;
}): React.ReactElement => {
  const webcamRef = useRef<Webcam>(null);
  const codeReader = new BrowserMultiFormatReader();
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef?.current?.getScreenshot();
    // const imageSrc = "testImg1.jpg";
      if (imageSrc) {
        codeReader.decodeFromImage(undefined, imageSrc).then(result => {
          onUpdate(null, result)
        }).catch((err) => {
          onUpdate(err)
        })
      }
    },
    [codeReader, onUpdate]
  )

  React.useEffect(() => {
    setInterval(capture, 100)
  }, []);

  return (
    <Webcam
      style={{objectFit:"cover", width:"100%", height:"100%"}}
      width={width}
      height={height}
      ref={webcamRef}
      screenshotFormat="image/png"
      videoConstraints={{
        facingMode: 'environment'
      }}
    />
  )
}

export default BarcodeScannerComponent;