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

const categories: Categories = {
    "example": "m@example.com",
    "google": "m@google.com",
    "support": "m@support.com"
};


const FormSchema = z.object({
    title: z.string().refine(value => value.trim() !== "", {
        message: "해당 값은 반드시 입력해야 합니다."
    }),
    category: z.string().refine(value => value.trim() !== "", {
        message: "해당 값은 반드시 입력해야 합니다."}),
})


export default function InputForm() {
    const [contents, setContents] = useState<string>(''); // content 상태를 상위 컴포넌트에서 관리

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            category: "",
        },
    })

    const handleContentChange = (content: string) => {
        setContents(content); // content가 변경될 때마다 상태를 업데이트
    };

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const results : Object = {
            contents:  contents,
            ...data
        }

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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={categories[field.value] ||  "카테고리를 선택해주세요."}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(categories).map(([key, value]) => (
                                            <SelectItem key ={key} value={key}>{value}</SelectItem>
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
