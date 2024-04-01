"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import "react-calendar/dist/Calendar.css";

import { getDaysInMonth, subMonths } from "date-fns";
import { Calendar } from "@/lib/axios-calendar";
import { useQuery } from "@tanstack/react-query";

interface ImageDates {
  [date: string]: string[];
}

interface WeekDay {
  day: number;
  otherMonth: boolean;
}

interface WeekDay {
  day: number;
  otherMonth: boolean;
}

type CALENDER_RESULT_LIST = WeekDay[][];

const UseCalendar = () => {
  const DAY_OF_WEEK = 7;
  const [currentDate, setCurrentDate] = useState(new Date());
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());
  const totalMonthDays = getDaysInMonth(currentDate);

  // 이전 달의 마지막 일요일까지의 날짜를 가져오는 로직
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const prevMonthDays = firstDayOfMonth.getDay(); // 첫째 날이 월요일이 아니라면, 이전 달의 날짜를 가져와야 함

  const prevDayList = Array.from({
    length: prevMonthDays,
  }).map((_, i) => {
    const day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      -prevMonthDays + i + 1
    ).getDate();
    return { day, otherMonth: true };
  });

  // 이번 달의 날짜를 가져오는 로직
  const currentDayList = Array.from({ length: totalMonthDays }).map((_, i) => ({
    day: i + 1,
    otherMonth: false,
  }));

  // 다음 달의 날짜를 계산하는 로직
  const totalDays =
    DAY_OF_WEEK * Math.ceil((prevDayList.length + currentDayList.length) / DAY_OF_WEEK);
  const nextDayList = Array.from({
    length: totalDays - currentDayList.length - prevDayList.length,
  }).map((_, i) => {
    const day = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i + 1).getDate();
    return { day, otherMonth: true };
  });

  // 현재 캘린더 배열 생성
  const currentCalendarList = prevDayList.concat(currentDayList, nextDayList);
  const weekCalendarList = currentCalendarList.reduce<CALENDER_RESULT_LIST>((acc, cur, idx) => {
    const chunkIndex = Math.floor(idx / DAY_OF_WEEK);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(cur);
    return acc;
  }, []);

  return {
    weekCalendarList: weekCalendarList,
    currentDate: currentDate,
    setCurrentDate: setCurrentDate,
  };
};

const Cal = () => {
  const [select, setSelect] = useState<number[]>([]);

  const DAY_LIST = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const calendar = UseCalendar();
  const CALENDER_RESULT_LIST = calendar.weekCalendarList;
  const { currentDate } = calendar; // 현재 날짜를 currentDate에서 구조 분해 할당합니다.

  // const imageDates: ImageDates = {
  //   '2024-02-28': ['book1.svg'],
  //   '2024-03-20': ['book1.svg', 'book3.svg'],
  //   '2024-03-23': ['book2.svg', 'book3.svg'],
  //   '2024-03-29': ['book4.svg'],
  //   '2024-03-31': ['book5.svg'],
  // };

  const {
    data: imageDates,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useQuery<ImageDates>({
    queryKey: ["myCompleteBooks"],
    queryFn: () => Calendar.date(CurrentDateYear, CurrentDateMonth),
  });

  const countBooksForMonth =
    imageDates &&
    Object.keys(imageDates).reduce((acc, date) => {
      if (
        date.startsWith(
          `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`
        )
      ) {
        return acc + imageDates![date].length;
      }
      return acc;
    }, 0);

  // 현재 날짜를 "년도-월-일" 형식으로 표시합니다.
  const CurrentDateYear = currentDate.getFullYear();
  const CurrentDateMonth = currentDate.getMonth() + 1;

  const getImageCountForDate = (year: number, month: number, day: number): number => {
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    return imageDates![formattedDate] ? imageDates![formattedDate].length : 0;
  };

  useEffect(() => {
    refetch();
  }, [CurrentDateYear, CurrentDateMonth]); // 연도나 월이 변경될 때마다 fetchData를 다시 호출

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error...</>;

  return (
    isSuccess && (
      <>
        <div className="flex justify-between pt-3 mb-3 pb-3 border-b border-gray-200">
          <div className="flex flex-col">
            {" "}
            {/* flex-col 클래스를 추가하여 자식 요소들을 세로로 정렬합니다. */}
            <div className="flex items-end mb-2">
              <div className="text-3xl mr-3 font-sans font-semibold text-gray-800">
                {CurrentDateMonth}월
              </div>
              <div className="text-sm">{CurrentDateYear}년</div>
            </div>
            <div className="text-xs text-gray-500">
              {" "}
              {/* 'flex' 텍스트를 날짜 아래에 배치합니다. */}이 달에 {countBooksForMonth}권을
              완독하였습니다.
            </div>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                calendar.setCurrentDate(subMonths(calendar.currentDate, 1)); // 다음 달로 이동
              }}
              className="px-0 py-0 w-8 h-8 bg-[#9268EB] mr-3 hover:bg-[#bfa1ff]"
            >
              <Image src="left.svg" alt="left" width={9} height={9} />
            </Button>
            <Button className="px-0 py-0 w-8 h-8 bg-[#9268EB] hover:bg-[#bfa1ff] mr-3">
              <Image src="calendar.svg" alt="calendar" width={21} height={21} />
            </Button>
            <Button
              onClick={() => {
                calendar.setCurrentDate(subMonths(calendar.currentDate, -1)); // 이전 달로 이동
              }}
              className="px-0 py-0 w-8 h-8 bg-[#9268EB] hover:bg-[#bfa1ff]"
            >
              <Image src="right.svg" alt="right" width={9} height={9} />
            </Button>
          </div>
        </div>

        <div className="flex w-full pb-2">
          {DAY_LIST.map((weekday, index) => {
            const isSunday = weekday === "SUN";
            const isSaturday = weekday === "SAT";
            const dayColor = isSunday
              ? "text-[#F15B5B]"
              : isSaturday
              ? "text-blue-500"
              : "text-black";

            return (
              <div
                className={`flex justify-center min-w-[calc(100%/7)] items-center text-center text-xs font-bold ${dayColor}`}
                key={index}
              >
                {weekday}
              </div>
            );
          })}
        </div>
        <div className="border-t border-l border-gray-300">
          {CALENDER_RESULT_LIST.map((week: WeekDay[], index: number) => (
            <div className="flex w-full border-b" key={index}>
              {week.map(({ day, otherMonth }, dayIndex) => {
                const imageCount = !otherMonth
                  ? getImageCountForDate(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
                  : 0;
                const firstImage =
                  imageCount > 0
                    ? imageDates[
                        `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                          .toString()
                          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`
                      ][0]
                    : null;
                const backgroundImageStyle = firstImage
                  ? {
                      backgroundImage: `url(${firstImage})`,
                      backgroundSize: "cover",
                    }
                  : {};

                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayOfWeek = date.getDay();
                const isSunday = dayOfWeek === 0;
                const isSaturday = dayOfWeek === 6;
                const dayColor = isSunday
                  ? "text-[#F15B5B]"
                  : isSaturday
                  ? "text-blue-500"
                  : "text-black";

                const handleDayClick = (dayInfo: WeekDay) => {
                  if (dayInfo.otherMonth) {
                    if (dayInfo.day > 15) {
                      // 이전 달의 날짜를 클릭한 경우
                      calendar.setCurrentDate(subMonths(calendar.currentDate, 1));
                    } else {
                      // 다음 달의 날짜를 클릭한 경우
                      calendar.setCurrentDate(subMonths(calendar.currentDate, -1));
                    }
                  }
                  // 여기에 다른 처리 로직 추가 (선택된 날짜 표시 등)
                };

                return (
                  <Button
                    onClick={() => handleDayClick({ day, otherMonth })}
                    style={backgroundImageStyle}
                    key={dayIndex}
                    className={`relative flex justify-start items-start w-16 h-20 min-w-[calc(100%/7)] text-xs bg-white ${dayColor} border-r border-gray-300 rounded-none font-bold  ${
                      otherMonth
                        ? "text-gray-400 bg-gray-200 hover:bg-gray-400 hover:text-white"
                        : "hover:bg-gray-400 hover:text-white"
                    } ${
                      select.find((selectedDay) => selectedDay === day) && !otherMonth
                        ? "bg-blue-600"
                        : ""
                    }`}
                  >
                    {imageCount > 1 && (
                      <div className="absolute right-0 top-0 bg-[#F87171] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center border border-white">
                        {imageCount}
                      </div>
                    )}
                    <div
                      className={`absolute top-0 left-0 flex items-center justify-center  rounded-full w-6 h-6 m-0.5`}
                    >
                      {imageCount === 0 && day}
                    </div>
                  </Button>
                );
              })}
            </div>
          ))}
        </div>
      </>
    )
  );
};

export default Cal;