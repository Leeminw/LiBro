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
import Editor from "@/components/ui/quill";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteClub, getClubDetail, updateClub } from "@/lib/club";
import { useParams, useRouter } from "next/navigation";
import BackBar from "@/components/layout/backbar";
import useUserState from "@/lib/login-state";
import SubHeader from "@/components/SubHeader";

const FormSchema = z.object({
  title: z.string().refine((value) => value.trim() !== "", {
    message: "해당 값은 반드시 입력해야 합니다.",
  }),
  content: z.string().refine((value) => value.trim() !== "", {
    message: "해당 값은 반드시 입력해야 합니다.",
  }),
});

export default function InputForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();

  const clubId = parseInt(params.id as string);

  const [contents, setContents] = useState<string>(""); // content 상태를 상위 컴포넌트에서 관리

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { getUserInfo } = useUserState();
  const userId = getUserInfo().id;

  const {
    isLoading,
    isFetching,
    data: club,
    isError: isFetchingError,
    error: FetchingError,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["club", clubId],
    queryFn: () => getClubDetail(clubId),
  });

  const {
    isPending: isEditPending,
    isError: isEditError,
    mutate: updateMutation,
  } = useMutation({
    mutationFn: (param: ClubWrite) => updateClub(clubId, param),
    onSuccess: (data, variables, context) => {
      toast({
        title: "데이터를 정상적으로 수정 하였습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["club", clubId] });
      router.push(`/club/${clubId}`);
    },
    onError: (data, variables, context) => {
      console.log(data);

      toast({
        title: "에러가 발생하여 데이터를 저장할 수 없습니다.",
      });
    },
  });

  const {
    isPending: isDeletePending,
    isError: isDeleteEror,
    error: delteError,
    mutate: deleteMutation,
  } = useMutation({
    mutationFn: () => deleteClub(clubId),
    onSuccess: (data, variables, context) => {
      toast({
        title: "클럽을 정상적으로 삭제 하였습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["myclubList"] });
      queryClient.invalidateQueries({ queryKey: ["clubList"] });
      router.push(`/club`);
    },
    onError: (data, variables, context) => {
      toast({
        title: "에러가 발생하여 클럽을 삭제 할 수 없습니다.",
      });
    },
  });

  const handleContentChange = (content: string) => {
    setContents(content); // content가 변경될 때마다 상태를 업데이트
    form.setValue("content", club.description);
  };
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const results: ClubWrite = {
      description: contents,
      name: data.title,
      userId: userId,
    };
    console.log(results);
    updateMutation(results);
  }
  const handleDelete = (data: z.infer<typeof FormSchema>) => {
    deleteMutation();

    toast({
      title: "삭제 당했어용",
      description: "",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      form.setValue("title", club.clubName);
      setContents(club.description);
      form.setValue("content", club.description);

      return () => {};
    }
  }, [isSuccess]);

  return (
    <>
      {/*<div className="pt-24"/>*/}
      <Form {...form}>
        <SubHeader title="커뮤니티 수정하기" backArrow={true} />
        <form className="space-y-2 pt-28 px-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full bg-white px-4 py-4 rounded-lg drop-shadow-lg border border-gray-200">
                <FormLabel className="font-semibold text-md">
                  커뮤니티명
                </FormLabel>
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

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full bg-white px-4 py-4 rounded-lg drop-shadow-lg border border-gray-200">
                <FormLabel className="font-semibold text-md">커뮤니티 설명</FormLabel>
                <FormControl>
                  <Editor contents={contents} onChange={handleContentChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              className="bg-[#9268EB] hover:bg-[#bfa1ff] w-20 mr-2"
              onClick={form.handleSubmit(onSubmit)}
            >
              수정
            </Button>
            <Button
              className="bg-red-400 hover:bg-red-300 w-20"
              onClick={form.handleSubmit(handleDelete)}
            >
              삭제
            </Button>
          </div>

          {/*<Editor contents={contents} onChange={handleContentChange}/>*/}
        </form>
      </Form>
    </>
  );
}
