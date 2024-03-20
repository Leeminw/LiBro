import { useState } from "react";
import { ProgressY } from "../ui/progress-y";

const DetailAnalyze = ({
  total,
  male,
  female,
  isLeft,
}: {
  total: number;
  male: number;
  female: number;
  isLeft: boolean;
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <div
      className="flex -mb-2 items-end"
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
      <div
        style={{ transformOrigin: isLeft ? "100% 0%" : "0% 0%" }}
        className={`w-24 h-20 ml-6 border border-gray-300 text-xs font-semibold text-gray-600 bg-white absolute z-10 rounded-lg flex flex-col justify-center items-center drop-shadow-lg transition duration-300 ${
          mouseOver ? "opacity-100 scale-100 " : "opacity-0 scale-0 "
        }
        translate-y-16
        ${isLeft ? "-translate-x-28" : ""}
        `}
      >
        <p className="select-none">
          전체 <span className="font-normal pl-1">{total}%</span>
        </p>
        <hr className="w-full my-2 "/>
        <p className="select-none">
          남성 <span className="font-normal pl-1">{male}%</span>
        </p>
        <p className="select-none">
          여성 <span className="font-normal pl-1">{female}%</span>
        </p>
      </div>
    </div>
  );
};
export default DetailAnalyze;
