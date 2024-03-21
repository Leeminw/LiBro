"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";

import makeAnimated from "react-select/animated";
import { ColourOption, colourOptions } from "./data";
import chroma from "chroma-js";
import SelectMenu, { ActionMeta, MultiValue } from "react-select";
import { StylesConfig } from "react-select";

const Header = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center p-3">
      <Button
        onClick={handleBack}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <img src="/back.svg" alt="Back" width={24} height={24} />
      </Button>
      <h1 className="ml-3 text-lg font-bold">추가 정보입력</h1>
    </div>
  );
};

const UserInfo = () => {
  const [stage, setStage] = useState(1);
  const [name, setName] = useState("");
  const [headerText, setHeaderText] = useState("닉네임을 입력하세요.");
  const [gender, setGender] = useState(""); // 성별 상태 추가
  const [age, setAge] = useState(""); // 나이 상태 추가

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleChange = (newValue: MultiValue<ColourOption>, actionMeta: ActionMeta<ColourOption>) => {
    if (newValue) {
      // 선택된 항목들에서 value만 추출하여 저장합니다.
      const values = newValue.map((option) => option.value);
      setSelectedValues(values);
    } else {
      setSelectedValues([]);
    }
  };

  // 성별과 나이가 모두 선택되었는지 확인하는 함수 추가
  const checkAndAdvanceStage = () => {
    if (gender !== "" && age !== "") {
      setStage(3);
    }
  };

  const colourStyles: StylesConfig<ColourOption, true> = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        borderColor: "#9268EB", // 테두리 색상 설정
        "&:hover": { borderColor: "#9268EB" }, // 마우스 호버 시 테두리 색상 유지
        boxShadow: "none", // 기본적으로 적용되는 그림자 제거 (선택적)
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ":hover": {
        backgroundColor: data.color,
        color: "white",
      },
    }),
  };

  return (
    <div
      className={`flex flex-col p-4 min-h-screen transition-all duration-500`}
    >
      {stage === 1 && (
        <div>
          <h1 className="text-lg font-bold mb-6">{headerText}</h1>
          <Input
            className="mb-4 px-4 py-2 border-[#9268EB] rounded w-full"
            placeholder="닉네임"
            type="name"
            value={name} // 입력값을 email 상태와 연결
            onChange={(e) => setName(e.target.value)} // 입력값 변경시 email 상태 업데이트
            onFocus={() => setHeaderText("닉네임을 입력하세요.")}
          />
          <Button
            className="mb-6 bg-[#9268EB] text-white px-6 py-2 rounded w-full"
            onClick={() => {
              setStage(2);
            }}
          >
            다음
          </Button>
        </div>
      )}
      {stage === 2 && (
        <div
          className={`flex flex-col transition-all duration-500 delay-500 ${
            stage === 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-lg font-semibold mb-6">{headerText}</h1>
          <div className="flex w-full mb-6">
            <Input
              className="px-4 py-2 border border-[#9268EB] rounded w-full"
              placeholder="닉네임을 다시 입력하세요."
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setHeaderText("닉네임을 입력하세요.")}
            />
          </div>
          <div className="flex w-full mb-6">
            <div
              className="flex w-1/3 mr-2"
              onFocus={() => setHeaderText("성별을 선택하세요.")}
            >
              <Select onValueChange={(value) => setGender(value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="성별" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="남성">남성</SelectItem>
                  <SelectItem value="여성">여성</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              className="flex w-3/4"
              onFocus={() => setHeaderText("나이를 선택하세요.")}
            >
              <Select onValueChange={(value) => setAge(value)}>
                <SelectTrigger id="age">
                  <SelectValue placeholder="나이" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="10대">10대</SelectItem>
                  <SelectItem value="20대">20대</SelectItem>
                  <SelectItem value="30대">30대</SelectItem>
                  <SelectItem value="40대">40대</SelectItem>
                  <SelectItem value="50대">50대</SelectItem>
                  <SelectItem value="60대">60대</SelectItem>
                  <SelectItem value="70대">70대</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="mb-6 bg-[#9268EB] text-white px-6 py-2 rounded w-full"
            onClick={checkAndAdvanceStage}
          >
            다음
          </Button>
        </div>
      )}
      {stage === 3 && (
        <div
          className={`flex flex-col transition-all duration-500 delay-500 ${
            stage === 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-lg font-semibold mb-6">{headerText}</h1>
          <div className="flex w-full mb-6">
            <Input
              style={{ borderColor: "#9268EB" }}
              className="px-4 py-2 border rounded w-full"
              placeholder="닉네임을 다시 입력하세요."
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setHeaderText("닉네임을 입력하세요.")}
            />
          </div>
          <div className="flex w-full mb-6">
            <div
              className="flex w-1/3 mr-2"
              onFocus={() => setHeaderText("성별을 선택하세요.")}
            >
              <Select>
                <SelectTrigger id="gender">
                  <SelectValue placeholder={gender} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              className="flex w-3/4"
              onFocus={() => setHeaderText("나이를 선택하세요.")}
            >
              <Select>
                <SelectTrigger id="age">
                  <SelectValue placeholder={age} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="10대">10대</SelectItem>
                  <SelectItem value="20대">20대</SelectItem>
                  <SelectItem value="30대">30대</SelectItem>
                  <SelectItem value="40대">40대</SelectItem>
                  <SelectItem value="50대">50대</SelectItem>
                  <SelectItem value="60대">60대</SelectItem>
                  <SelectItem value="70대">70대</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div
            className="flex w-full flex-col gap-5 mb-6 bg-white "
            onFocus={() => setHeaderText("관심분야를 선택하세요.")}
          >
            <SelectMenu
              closeMenuOnSelect={false}
              placeholder="관심분야 선택"
              isMulti={true}
              options={colourOptions}
              styles={colourStyles}
              minMenuHeight={130}
              onChange={handleChange}
            />
          </div>
          <Button className="mb-6 bg-[#9268EB] text-white px-6 py-2 rounded w-full">
            확인
          </Button>
        </div>
      )}
    </div>
  );
};

const Addinfo = () => {
  return (
    <>
      <Header />
      <UserInfo />
    </>
  );
};
export default Addinfo;
