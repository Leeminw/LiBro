"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {Input} from "@/components/ui/input"
import {toast} from "@/components/ui/use-toast"
import {Button} from "@/components/ui/button";
import {Editor} from "@/components/ui/quill";
import {useState} from "react";

interface Categories {
    [key: string]: string;
}

const FormSchema = z.object({
    title: z.string().refine(value => value.trim() !== "", {
        message: "해당 값은 반드시 입력해야 합니다."
    }),
})


export default function InputForm() {
    const [contents, setContents] = useState<string>(''); // content 상태를 상위 컴포넌트에서 관리

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "11111",
        },
    });

    const handleContentChange = (content: string) => {
        setContents(content); // content가 변경될 때마다 상태를 업데이트
    };

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const results: Object = {
            contents: contents,
            ...data
        }

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(results, null, 2)}</code>
                </pre>
            ),
        });
    }

    const handleDelete = (data: z.infer<typeof FormSchema>) => {
        toast({
            title: "삭제 당했어용",
            description: "",
        });
    };

    return (
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
    );
}
