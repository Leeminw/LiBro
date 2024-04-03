import CategoryList from "@/components/components/admin/BoardList";
import SubHeader from "@/components/SubHeader";
import React from "react";


export default function CategoryAdmin(){
    return (
        <>
            <SubHeader title="게시판 관리" backArrow={true}/>
            <div className="pt-14"/>
            <CategoryList/>
        </>
    )
}
