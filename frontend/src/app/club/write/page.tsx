"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"

import {Input} from "@/components/ui/input"
import {toast} from "@/components/ui/use-toast"
import {Button} from "@/components/ui/button";
import {Editor} from "@/components/ui/quill";
import React, {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {writeClub} from "@/lib/club";
import {useParams, useRouter} from "next/navigation";
import BackBar from "@/components/layout/backbar";


const FormSchema = z.object({
    title: z.string().refine(value => value.trim() !== "", {
        message: "해당 값은 반드시 입력해야 합니다."
    }),
})


export default function InputForm() {
    const [contents, setContents] = useState<string>(''); // content 상태를 상위 컴포넌트에서 관리

    const queryClient = useQueryClient();
    const router = useRouter();
    const params = useParams()

    const {isPending, isError, error, mutate, data} = useMutation({
        mutationFn: (param) => writeClub(param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "데이터를 정상적으로 저장하였습니다.",
            });
            queryClient.invalidateQueries(['clubList']);
            queryClient.invalidateQueries(['myclubList']);
            router.push(`/club/${data.clubId}`);
        },
        onError: () => {
            toast({
                title: "에러가 발생하여 데이터를 저장할 수 없습니다.",
            });
        },
    })


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
        },
    })

    const handleContentChange = (content: string) => {
        setContents(content); // content가 변경될 때마다 상태를 업데이트
    };

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const results: ClubWrite = {
            description: contents,
            name: data.title,
            userId: 1
        }

        mutate(results);

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(results, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (

        <>
            <BackBar title="커뮤니티 만들기"/>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-end">
                        <Button type="submit">Submit</Button>
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
