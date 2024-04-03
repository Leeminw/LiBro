"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeClub } from "@/lib/club";
import { useParams, useRouter } from "next/navigation";
import BackBar from "@/components/layout/backbar";
import useUserState from "@/lib/login-state";
import dynamic from "next/dynamic";
import SubHeader from "@/components/SubHeader";

const FormSchema = z.object({
  title: z.string().refine((value) => value.trim() !== "", {
    message: "해당 값은 반드시 입력해야 합니다.",
  }),
  contents: z.string(),
});

const Editor = dynamic(() => import("@/components/ui/quill"), {
  ssr: false,
});

export default function InputForm() {
  const [contents, setContents] = useState<string>(""); // content 상태를 상위 컴포넌트에서 관리

  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const { getUserInfo } = useUserState();
  const userId = getUserInfo().id;

  const { isPending, isError, error, mutate, data } = useMutation({
    mutationFn: (param: ClubWrite) => writeClub(param),
    onSuccess: (data, variables, context) => {
      toast({
        title: "새 커뮤니티를 만들었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["clubList"] });
      queryClient.invalidateQueries({ queryKey: ["myclubList"] });
      router.push(`/club/${data.clubId}`);
    },
    onError: () => {
      toast({
        title: "커뮤니티를 만드는 과정에서 오류가 발생했습니다.",
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleContentChange = (content: string) => {
    setContents(content); // content가 변경될 때마다 상태를 업데이트
    form.setValue("contents", content);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const results: ClubWrite = {
      description: contents,
      name: data.title,
      userId: userId,
    };

    mutate(results);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(results, null, 2)}</code>
        </pre>
      ),
    });
  }

  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    // 클라이언트 측에서만 Quill Editor가 로드되었음을 설정
    setEditorLoaded(true);
  }, []);

  return (
    <>
      <SubHeader title="커뮤니티 만들기" backArrow={true} src={"/club"} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pt-16 flex flex-col px-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">커뮤니티명</FormLabel>
                <FormControl>
                  <Input
                    placeholder="커뮤니티의 이름을 입력해주세요."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {editorLoaded && (
            <FormField
              control={form.control}
              name="contents"
              render={({ field }) => (
                <FormItem className="mt-4 pb-8">
                  <FormLabel className="font-semibold">커뮤니티 설명</FormLabel>
                  <FormControl>
                    <Editor
                      contents={contents}
                      onChange={handleContentChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex justify-end">
            <Button type="submit" className="bg-[#9268EB] hover:bg-[#bfa1ff]">만들기</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
