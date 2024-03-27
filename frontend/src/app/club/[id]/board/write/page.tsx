'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import React, {useState} from "react"; // 추가
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";
import {Editor} from "@/components/ui/quill";

import {getCategoryList, writePost} from "@/lib/club";
import {QueryClient, useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {useParams, useRouter} from "next/navigation";
import SubHeader from "@/components/SubHeader";
import useUserState from "@/lib/login-state";


const FormSchema = z.object({
    title: z.string().refine(value => value.trim() !== "", {
        message: "해당 값은 반드시 입력해야 합니다."
    }),
    category: z.string().refine(value => value.trim() !== "", {
        message: "해당 값은 반드시 입력해야 합니다."
    }),
});


export default function InputForm() {

    const router = useRouter();
    const params = useParams()
    const clubId = params.id;

    const {
        isLoading,
        isFetching,
        data: categories,
        isError: isFetchingError,
        error: FetchingError,
        refetch
    } = useSuspenseQuery({
        queryKey: ['clubCategory', clubId],
        queryFn: () => getCategoryList(parseInt(clubId))
    });

    const queryClient = new QueryClient();
    const { getUserInfo } = useUserState();
    const userId = getUserInfo().id;


    const {isPending, isError, error, mutate, data} = useMutation({
        mutationFn: (param) => writePost(param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "데이터를 정상적으로 저장하였습니다.",
            });
            queryClient.invalidateQueries(['articleList']);
            router.push(`/club/${clubId}/board/${data.data.id}`);
        },
        onError: () => {
            toast({
                title: "에러가 발생하여 데이터를 저장할 수 없습니다.",
            });
        },
    })


    const [contents, setContents] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>(""); // 선택된 카테고리를 상태로 관리합니다.

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            category: "",
        },
    });

    const handleContentChange = (content: string) => {
        setContents(content);
    };

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const results: Object = {
            content: contents,
            title: data["title"],
            boardId: parseInt(data["category"]),
            userId: userId
        };

        mutate(results)

        toast({
            title: "You submitted the following values:",
        });
    }

    if (isLoading || isFetching) return <>Loading...</>;
    if (isFetchingError) return <>{FetchingError.message}</>;

    return (
        <>
            <SubHeader title="글 작성하기" backArrow={true}/>
            <div className="pt-24"/>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-end">
                        <Button type="submit">작성하기</Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="category"
                        render={({field}) => (
                            <FormItem className="w-2/3">
                                <FormLabel>카테고리</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setSelectedCategory(value);
                                    }}
                                    defaultValue={form.getValues("category")}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="카테고리를 선택해주세요."/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem className="w-2/3">
                                <FormLabel>제목</FormLabel>
                                <FormControl>
                                    <Input placeholder="제목을 입력해주세요." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Editor contents={contents} onChange={handleContentChange}/>
                </form>
            </Form>
        </>

    );
}
