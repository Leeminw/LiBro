'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useState, useEffect} from "react"; // 추가

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";
import {Editor} from "@/components/ui/quill";

import {editPost, getCategoryList, getPostDetail, writePost} from "@/lib/club";
import {
    QueryClient,
    useMutation,
    useQueries,
    useQuery,
    useSuspenseQueries,
    useSuspenseQuery
} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {signOut} from "next-auth/react";


const FormSchema = z.object({
    title: z.string().refine(value => value.trim() !== "", {
        message: "해당 값은 반드시 입력해야 합니다."
    }),
    category: z.string().refine(value => value.trim() !== "", {
        message: "해당 값은 반드시 입력해야 합니다."
    }),
});

const queryClient = new QueryClient()

export default function InputForm({params}: { params: { id: number, boardId: number } }) {
    const {id: clubId, boardId} = params;
    const router = useRouter();

    const results = useQueries({
        queries: [
            {
                queryKey: ['clubCategory', clubId],
                queryFn: () => getCategoryList(clubId)
            },

            {
                queryKey: ['boardDetail', boardId],
                queryFn: () => getPostDetail(boardId)
            }
        ]
    });

    const isLoading = results.some((query) => query.isLoading);
    const hasError = results.some((query) => query.isError);
    const isSuccess = results.every((query) => query.isSuccess);

    const [categories, post] = results.map(result => result.data)
    //
    // const categories = fetchedCategories.data
    // const post = fetchedPost.data

    const {isPending, isError, error, mutate, data} = useMutation({
        mutationFn: (param) => editPost(boardId, param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "데이터를 정상적으로 수정 하였습니다.",
                description : `${JSON.stringify(data, null, 2)}`
            });
            queryClient.invalidateQueries(['boardDetail', boardId])
            queryClient.invalidateQueries(['articleList']);
            router.push(`/club/${clubId}/board/${boardId}`);
        },
        onError: (data, variables, context) => {
            console.log(data)

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
            title: '',
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
            userId: 1
        };

        mutate(results)

        toast({
            title: "You submitted the following values:",
            description : `${JSON.stringify(results, null, 2)}`
        });
    }

    useEffect(() => {
        if (isSuccess) {
            form.setValue("title", post.title);
            form.setValue("category", post.boardId.toString());
            setContents(post.content);

            return () => {
            };
        }
    }, [isSuccess]);

    if (isLoading) return <>Loading...</>;
    if (hasError) return <>Error</>;

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-end">
                    <Button type="submit">Submit</Button>
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
                                defaultValue={post.boardId.toString()}
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
    );
}
