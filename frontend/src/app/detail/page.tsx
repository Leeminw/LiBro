"use client";
import SubHeader from "@/components/SubHeader";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const DetailPage = () => {
  const isbn = useSearchParams().get("isbn");
  return (
    <>
      <SubHeader title="도서 상세 정보" backArrow={true} />
      <div className="pt-24">상세페이지에요 검색된 데이터 : {isbn}</div>
    </>
  );
};
export default DetailPage;
