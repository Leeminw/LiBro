"use client";
import Shorts from "@/components/shorts/Shorts";
import { Button } from "@/components/ui/button";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";

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
      <div className="bg-white border-b border-gray-300 max-w-md w-full z-50 absolute h-24 flex-col">
        <div className="flex h-1/2 items-center border-b border-gray-300">
          <div className="w-full pl-12 flex justify-center">Header</div>
          <Button variant="outline" size="icon" className="aspect-square mr-4">
            <AiOutlineSearch size={"1.2rem"} className="justify-items-end" />
          </Button>
        </div>
        <div className="w-full flex h-1/2 items-center pl-2 text-md font-semibold">
          오늘의 도서 추천
        </div>
      </div>
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
