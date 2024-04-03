"use client";
import React, { useRef } from "react";
import { Camera, CameraType } from "react-camera-pro";
import axios from "axios";

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
            .catch((error) => {
            });
        }
      } catch (error) {}
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Camera
        ref={camera}
        errorMessages={{
          canvas: "Canvas is not supported",
          noCameraAccessible: "No camera accessible",
          permissionDenied: "Permission denied",
          switchCamera: "It is not possible to switch camera",
        }}
      />
    </div>
  );
};

export default BarcodeScannerComponent;
