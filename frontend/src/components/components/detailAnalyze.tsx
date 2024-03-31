import { useState } from "react";
import { ProgressY } from "../ui/progress-y";

const DetailAnalyze = ({
  male,
  female,
  isLeft,
  description,
}: {
  male: number;
  female: number;
  isLeft: boolean;
  description: string;
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <div className="flex -mb-2 items-end relative justify-center">
      <div
        onMouseOver={() => {
          setMouseOver(true);
        }}
        onMouseLeave={() => {
          setMouseOver(false);
        }}
        className="flex flex-col h-[94%] justify-end"
      >
        <ProgressY
          className="w-5 h-full bg-transparent"
          indicatorColor=""
          fval={female}
          mval={male}
          value={female + male}
        />
      </div>

      <div className="absolute text-xs text-[#888888] w-fit text-nowrap -mb-5">{description}</div>
      <div
        style={{ transformOrigin: isLeft ? "100% 0%" : "0% 0%" }}
        className={`w-24 h-fit py-2 ml-6 border border-gray-300 text-xs font-semibold text-gray-600 bg-white absolute z-10 space-y-0.5 rounded-lg flex flex-col justify-center items-start drop-shadow-lg transition duration-300 ${
          mouseOver ? "opacity-100 scale-100 " : "opacity-0 scale-0 "
        }
        translate-y-24
        ${isLeft ? "-translate-x-[4.7rem]" : "translate-x-[3.2rem]"}
        `}
      >
        <p className="select-none text-sm px-3 mb-1">{description}</p>
        <hr className="w-full" />
        <p className="select-none px-3 pt-2">
          전체 <span className="font-normal pl-1 text-xs">{male + female}%</span>
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
