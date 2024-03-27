"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LoginApi } from "@/lib/axios-login";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ColourOption, colourOptions } from "./data";
import chroma from "chroma-js";
import SelectMenu, { ActionMeta, MultiValue } from "react-select";
import { StylesConfig } from "react-select";
import SubHeader from "@/components/SubHeader";

const UserInfo = () => {
  const [pageLoad, setPageLoad] = useState<boolean>(false);
  const [stage, setStage] = useState<number>(1);
  const [headerText, setHeaderText] = useState<string>("닉네임을 입력하세요.");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const accessToken = useSearchParams().get("accessToken");
  const refreshToken = useSearchParams().get("refreshToken");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setPageLoad(true);
  }, []);

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

  const formSchema = z.object({
    id: z.number(),
    nickname: z.string().min(2, {
      message: "닉네임은 2글자 이상으로 입력해주세요.",
    }),
    gender: z.string({
      required_error: "성별을 입력해주세요.",
    }),
    age: z.string({
      required_error: "나이를 입력해주세요.",
    }),
    interest: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      nickname: "",
      interest: [],
    },
  });

  const handleChange = (
    newValue: MultiValue<ColourOption>,
    actionMeta: ActionMeta<ColourOption>
  ) => {
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
    if (stage === 1) {
      setHeaderText("성별과 연령대를 선택해주세요.");
      setStage(2);
    } else {
      setHeaderText("관심분야를 선택하세요.");
      setStage(3);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    values.interest = selectedValues;
    console.log(values);
    localStorage.setItem("accessToken", accessToken ? accessToken : "");
    localStorage.setItem("refreshToken", refreshToken ? refreshToken : "");
    LoginApi.addInfo(values)
      .then(() => {
        
        router.push(`/login/loading?accessToken=${accessToken}&refreshToken=${refreshToken}`);
      })
      .catch((error) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
        toast({
          title: "회원가입 실패",
          description: "다시 로그인을 시도해주세요.",
        });
      });
  };

  return (
    <div className="flex flex-col pt-28 px-6 transition-all duration-500">
      {pageLoad && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <div>
                  <h1 className="text-lg font-bold mb-6">{headerText}</h1>
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <Input
                        className="px-4 border-[#9268EB] rounded w-full"
                        placeholder="닉네임"
                        type="name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      2글자 이상으로 입력해주세요.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <div
              className={`flex transition-all duration-500 delay-500 ${
                stage >= 2 ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <div className="w-1/2 mr-2">
                    <FormItem>
                      <FormLabel>성별</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger {...field}>
                            <SelectValue placeholder="성별" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper">
                          <SelectItem value="m">남성</SelectItem>
                          <SelectItem value="f">여성</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <div className="w-1/2">
                    <FormItem>
                      <FormLabel>연령대</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="나이" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper">
                          <SelectItem value="10">10대</SelectItem>
                          <SelectItem value="20">20대</SelectItem>
                          <SelectItem value="30">30대</SelectItem>
                          <SelectItem value="40">40대</SelectItem>
                          <SelectItem value="50">50대</SelectItem>
                          <SelectItem value="60">60대</SelectItem>
                          <SelectItem value="70">70대</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>
            <div
              className={`flex flex-col py-3 transition-all duration-500 delay-500 ${
                stage === 3 ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                관심분야 선택
              </label>
              <SelectMenu
                className="mt-3 mb-2"
                id="interest"
                closeMenuOnSelect={false}
                placeholder="관심분야 선택"
                isMulti={true}
                options={colourOptions}
                styles={colourStyles}
                onChange={handleChange}
              />
            </div>

            {stage === 3 && (
              <Button
                type="submit"
                className="mb-6 bg-[#9268EB] text-white px-6 py-2 rounded w-full"
              >
                확인
              </Button>
            )}
          </form>
        </Form>
      )}
      {stage !== 3 && pageLoad && (
        <Button
          className="my-6 bg-[#9268EB] text-white px-6 rounded w-full"
          onClick={checkAndAdvanceStage}
        >
          다음
        </Button>
      )}
    </div>
  );
};

const Addinfo = () => {
  return (
    <>
      <SubHeader title="회원 가입" backArrow={true} />
      <UserInfo />
    </>
  );
};
export default Addinfo;
