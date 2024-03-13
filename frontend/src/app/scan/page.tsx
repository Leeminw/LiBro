"use client";
import BarcodeScannerComponent from "@/components/BarcodeScanner";
import { useRouter } from "next/navigation";

const ScanPage = () => {
  const router = useRouter();
  return (
    <>
      <div className="border-b border-gray-200 bg-white w-full max-w-md flex h-14 items-center mt-14 pl-4 text-md font-semibold text-[#333333] fixed z-10">
        도서 검색
      </div>
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
                router.push(`/search/${isbn}`);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ScanPage;
