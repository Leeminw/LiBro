"use client";
import Shorts from "@/components/Shorts";
import { Button } from "@/components/ui/button";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import SubHeader from "@/components/SubHeader";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const element: HTMLDivElement = carouselRef.current;
        const totalScrollHeight = element.scrollHeight - element.clientHeight;
        const scrollRatio = element.scrollTop / totalScrollHeight;
        const itemCount = 4;
        const index = Math.round(scrollRatio * (itemCount - 1));
        setCurrentIndex(index);
      }
    };
    const element = carouselRef.current;
    if (element) {
      element.addEventListener("scrollend", handleScroll);
      return () => element.removeEventListener("scrollend", handleScroll);
    }
  }, []);

  useEffect(() => {
    console.log(currentIndex);
  }, [currentIndex]);

  return (
    <>
      <SubHeader title="오늘의 도서 추천" backArrow={false}/>
      <div
        ref={carouselRef}
        className="flex overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        <div className="flex flex-col min-h-screen flex-nowrap w-full">
          <Shorts idx={0} />
          <Shorts idx={1} />
          <Shorts idx={2} />
          <Shorts idx={3} />
        </div>
      </div>
    </>
  );
}
