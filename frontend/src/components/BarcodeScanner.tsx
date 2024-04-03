"use client";
import React, { useRef } from "react";
import { Camera, CameraType } from "react-camera-pro";
import axios from "axios";
import { LuSwitchCamera } from "react-icons/lu";

const BarcodeScannerComponent = ({
  onScanned,
}: {
  onScanned: (result: string) => void;
}): React.ReactElement => {
  const camera = useRef<CameraType>(null);
  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const screenShot = camera.current?.takePhoto();
        if (screenShot) {
          const response = await fetch(screenShot);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append("image", blob, "photo.png");
          axios
            .post("/flask/api/v1/isbn", formData)
            .then((response) => {
              onScanned(response.data.data.isbn);
            })
            .catch((error) => {});
        }
      } catch (error) {}
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div
        className="absolute right-2 bottom-2 w-12 h-12 bg-black/60 rounded-full flex items-center justify-center z-10"
        onClick={() => {
          camera.current?.switchCamera();
        }}
      >
        <LuSwitchCamera className="text-white w-6 h-6" />
      </div>
      <Camera
        ref={camera}
        errorMessages={{
          canvas: "지원되지 않는 기기입니다.",
          noCameraAccessible: "사용 가능한 카메라를 찾지 못했습니다.",
          permissionDenied: "권한이 거부되었습니다.",
          switchCamera: "카메라 전환에 실패했습니다.",
        }}
      />
    </div>
  );
};

export default BarcodeScannerComponent;
