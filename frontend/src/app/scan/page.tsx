"use client";
import BarcodeScannerComponent from "@/components/BarcodeScanner";
import SubHeader from "@/components/SubHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ScanPage = () => {
  const router = useRouter();

  return (
    <>
      <SubHeader title="도서 검색" backArrow={true} />
      <div className="flex items-center min-h-screen justify-center">
        <div className="relative bg-slate-500 w-full flex items-center justify-center h-80">
          <div className="absolute w-2/3 h-2/3 border-4 border-white"></div>
          <div className="absolute bg-black/60 py-2 px-7 rounded-full self-end text-white mb-2 text-sm">
            바코드를 인식시켜주세요.
          </div>
          <BarcodeScannerComponent
            width={300}
            height={300}
            onUpdate={(err, result) => {
              if (result) {
                const isbn = result.getText();
                router.push(`/detail?isbn=${isbn}`);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ScanPage;
