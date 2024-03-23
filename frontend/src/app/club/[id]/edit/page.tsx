"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"

import {Input} from "@/components/ui/input"
import {toast} from "@/components/ui/use-toast"
import {Button} from "@/components/ui/button";
import {Editor} from "@/components/ui/quill";
import React, {useEffect, useState} from "react";
import SubHeader from "@/components/SubHeader";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteClub, getClubDetail, updateClub} from "@/lib/club";
import {useParams, useRouter} from "next/navigation";

const FormSchema = z.object({
    title: z.string().refine(value => value.trim() !== "", {
        message: "해당 값은 반드시 입력해야 합니다."
    }),
})


export default function InputForm() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const params = useParams();

    const clubId = params.id;

    const [contents, setContents] = useState<string>(''); // content 상태를 상위 컴포넌트에서 관리

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });


    const {
        isLoading,
        isFetching,
        data: club,
        isError: isFetchingError,
        error: FetchingError,
        refetch,
        isSuccess
    } = useQuery({
        queryKey: ['club', clubId],
        queryFn: () => getClubDetail(clubId)
    });

    const {isPending: isEditPending, isError: isEditError, mutate: updateMutation} = useMutation({
        mutationFn: (param) => updateClub(clubId, param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "데이터를 정상적으로 수정 하였습니다.",
            });
            queryClient.invalidateQueries(['club', clubId])
            router.push(`/club/${clubId}`);
        },
        onError: (data, variables, context) => {
            console.log(data)

            toast({
                title: "에러가 발생하여 데이터를 저장할 수 없습니다.",
            });
        },
    })

    const {isPending: isDeletePending, isError: isDeleteEror, error: delteError, mutate: deleteMutation} = useMutation({
        mutationFn: () => deleteClub(clubId),
        onSuccess: (data, variables, context) => {
            toast({
                title: "클럽을 정상적으로 삭제 하였습니다.",
            });
            queryClient.invalidateQueries(['myclubList']);
            queryClient.invalidateQueries(['clubList']);
            router.push(`/club`);
        },
        onError: (data, variables, context) => {
            toast({
                title: "에러가 발생하여 클럽을 삭제 할 수 없습니다.",
            });
        },
    })

    const handleContentChange = (content: string) => {
        setContents(content); // content가 변경될 때마다 상태를 업데이트

    };
    function onSubmit(data: z.infer<typeof FormSchema>) {

        const results: ClubWrite = {
            description: contents,
            name: data.title,
            userId: 1,
        }
        console.log(results)
        updateMutation(results);

    }
    const handleDelete = (data: z.infer<typeof FormSchema>) => {
        deleteMutation(clubId)

        toast({
            title: "삭제 당했어용",
            description: "",
        });

    };

    useEffect(() => {
        if (isSuccess) {
            form.setValue("title", club.clubName);
            setContents(club.description);

            return () => {
            };
        }
    }, [isSuccess]);

    return (
        <>
            <SubHeader title="커뮤니티 수정하기" backArrow={true}/>
            <div className="pt-24"/>

            <Form {...form}>
                <form className="space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={form.handleSubmit(handleDelete)}>Delete</Button>
                        <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem className="w-2/3">
                                <FormLabel>커뮤니티명</FormLabel>
                                <FormControl>
                                    <Input placeholder="커뮤니티의 이름을 입력해주세요." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contents"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>커뮤니티 설명</FormLabel>
                                <FormControl>
                                    <Editor contents={contents} onChange={handleContentChange}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </>
    );
}
