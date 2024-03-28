import { useState } from "react";
import { ProgressY } from "../ui/progress-y";

const DetailAnalyze = ({
  total,
  male,
  female,
  isLeft,
  description,
}: {
  total: number;
  male: number;
  female: number;
  isLeft: boolean;
  description: string;
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <div
      className="flex -mb-2 items-end relative"
      onMouseOver={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
    >
      <ProgressY
        className="h-full bg-transparent pt-2"
        indicatorColor="bg-blue-400 duration-500"
        value={male}
      />
      <ProgressY
        className="h-full bg-transparent pt-2"
        indicatorColor="bg-red-400 duration-500"
        value={female}
      />
      <div className="absolute text-xs text-[#888888] w-20 px-1 -mb-5">
        {description}
      </div>
      <div
        style={{ transformOrigin: isLeft ? "100% 0%" : "0% 0%" }}
        className={`w-24 h-fit py-2 ml-6 border border-gray-300 text-xs font-semibold text-gray-600 bg-white absolute z-10 space-y-0.5 rounded-lg flex flex-col justify-center items-start drop-shadow-lg transition duration-300 ${
          mouseOver ? "opacity-100 scale-100 " : "opacity-0 scale-0 "
        }
        translate-y-16
        ${isLeft ? "-translate-x-28" : ""}
        `}
      >
        <p className="select-none text-sm px-3 mb-1">{description}</p>
        <hr className="w-full" />
        <p className="select-none px-3 pt-2">
          전체 <span className="font-normal pl-1 text-xs">{total}%</span>
        </p>
        <p className="select-none px-3">
          남성 <span className="font-normal pl-1 text-xs">{male}%</span>
        </p>
        <p className="select-none px-3">
          여성 <span className="font-normal pl-1 text-xs">{female}%</span>
        </p>
      </div>
    </div>
  );
};
export default DetailAnalyze;
