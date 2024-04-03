"use client";
import { useState } from "react";
import { FaStar } from "react-icons/fa6";

interface DetailRatingProps {
  userRating: RatingComment;
}

const DetailRating = ({ userRating }: DetailRatingProps) => {
  const [spoilerHide, setSpoilerHide] = useState<boolean>(false);
  return (
    <div className="flex flex-col relative space-y-1 justify-between bg-white border border-gray-200 w-full min-h-28 rounded-lg drop-shadow-md my-4">
      {userRating.ratingSpoiler && (
        <div
          onClick={() => {
            setSpoilerHide(true);
          }}
          className={`absolute w-full h-full backdrop-blur-sm flex flex-col items-center justify-center text-sm cursor-pointer font-semibold ${
            spoilerHide ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
        >
          <p>스포일러가 포함되어 있는 리뷰입니다.</p>
          <p>눌러서 열람하실 수 있습니다.</p>
        </div>
      )}
      <div className="flex p-4">
        <p className="font-semibold text-sm w-full flex">
          {userRating.nickName}
        </p>
        <div className="flex">
          <FaStar
            className={`w-5 h-5 ${
              userRating.rating > 0 ? "text-yellow-300" : "text-gray-300"
            } me-1`}
          />
          <FaStar
            className={`w-5 h-5 ${
              userRating.rating > 1 ? "text-yellow-300" : "text-gray-300"
            } me-1`}
          />
          <FaStar
            className={`w-5 h-5 ${
              userRating.rating > 2 ? "text-yellow-300" : "text-gray-300"
            } me-1`}
          />
          <FaStar
            className={`w-5 h-5 ${
              userRating.rating > 3 ? "text-yellow-300" : "text-gray-300"
            } me-1`}
          />
          <FaStar
            className={`w-5 h-5 ${
              userRating.rating > 4 ? "text-yellow-300" : "text-gray-300"
            } me-1`}
          />
        </div>
      </div>
      <p className="text-xs text-gray-400 pl-4">
        {new Intl.DateTimeFormat("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date(userRating.createdDate))}
      </p>

      <p className="text-sm py-2 pl-4 pb-4">{userRating.ratingComment}</p>
    </div>
  );
};

export default DetailRating;
