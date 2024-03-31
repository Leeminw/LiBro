'use client'

import {useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query'; // Import React Query hooks
import {Button} from "@/components/ui/button";
import {CheckIcon, FileEditIcon, TrashIcon, XIcon} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useParams} from "next/navigation";
import {deleteCategory, getCategoryList, updateCategory, writeCategory} from "@/lib/club";
import {toast} from "@/components/ui/use-toast";

function CategoryItem({category, onEditStart, onDelete}: { category: any, onEditStart: any, onDelete: any }) {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(category.name); // Change category.name to category.title

    const handleEditStart = () => {
        setEditing(true);
    };

    const handleEditFinish = () => {
        setEditing(false);
        onEditStart(category.id, inputValue);
    };

    const handleEditCancel = () => {
        setEditing(false);
        setInputValue(category.title); // Change category.name to category.title
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="flex items-center justify-between p-4">
            {editing ? (
                <>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        autoFocus
                        className="border border-gray-300 px-2 py-1 rounded-md"
                    />
                    <div className="flex items-center space-x-2">
                        <CheckIcon className="text-green-500 cursor-pointer" onClick={handleEditFinish} />
                        <XIcon className="text-red-500 cursor-pointer" onClick={handleEditCancel} />
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-lg cursor-pointer"
                        onClick={handleEditStart}>{category.name}</h2> {/* Change category.name to category.title */}
                    <div className="flex items-center space-x-2">
                        <FileEditIcon className="text-gray-600 cursor-pointer" onClick={handleEditStart} />
                        <TrashIcon className="text-gray-600 cursor-pointer" onClick={() => onDelete(category.id)} />
                    </div>
                </>
            )}
        </div>
    );
}

export default function CategoryList() {

    const params = useParams();
    const clubId = parseInt(params.id as string);
    // const queryClient = useQueryClient();

    const {data: todos, isLoading, isError, refetch} = useQuery({
        queryKey: ['categories', clubId],
        queryFn: () => getCategoryList(clubId)
    });

    const addCategoryMutation = useMutation({
        // 변경시 사용할 네트워크 요청코드 입니다.
        mutationFn: (param: CategoryWrite) => writeCategory(param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "데이터를 정상적으로 저장하였습니다.",
            });
            refetch();
        },

        onError: (data, variables, context) => {
            toast({
                title: "에러가 발생하여 데이터를 저장할 수 없습니다.",
            });
        }
    });
    const updateCategoryMutation = useMutation({
        // 변경시 사용할 네트워크 요청코드 입니다.
        mutationFn: (param: CategoryUpdate) => updateCategory(param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "게시판을 정상적으로 수정 하였습니다.",
            });
            refetch();
        },

        onError: (data, variables, context) => {
            toast({
                title: "에러가 발생하여 게시파을 수정 할 수 없습니다.",
            });
        }
    });
    const deleteCategoryMutation = useMutation({
        // 변경시 사용할 네트워크 요청코드 입니다.
        mutationFn: (param: number) => deleteCategory(param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "게시판을 정상적으로 삭제 하였습니다.",
            });
            refetch();
        },

        onError: (data, variables, context) => {
            toast({
                title: "에러가 발생하여 게시판을 삭제 할 수 없습니다.",
            });
        }
    });

    const [addingTodo, setAddingCategory] = useState(false);
    const [newTodoTitle, setNewCategory] = useState('');

    const handleAddTodo = () => {
        setAddingCategory(true);
    };

    const handleConfirmAddTodo = async () => {
        if (newTodoTitle.trim() !== '') {
            const newVar: CategoryWrite = {name: newTodoTitle, clubId: clubId};
            console.log(newVar)
            await addCategoryMutation.mutateAsync(newVar);
            setAddingCategory(false);
            setNewCategory('');
        }
    };

    const handleCancelAddTodo = () => {
        setAddingCategory(false);
        setNewCategory('');
    };

    const handleEditStart = async (id: number, newTitle: string) => {
        const newVar: CategoryUpdate = {name: newTitle, clubId: clubId, boardId: id};
        await updateCategoryMutation.mutateAsync(newVar);
    };

    const handleDeleteTodo = async (id: number) => {
        await deleteCategoryMutation.mutateAsync(id);
    };

    return (
        <div className="flex flex-col bg-white">
            <div className="flex justify-end p-4">
                <Button onClick={handleAddTodo} className="bg-purple-600 text-white">추가</Button>
            </div>

            <ScrollArea className="flex flex-col bg-white h-[calc(90vh-120px)]">
                {isLoading ? (
                    <div>Loading...</div>
                ) : isError ? (
                    <div>Error fetching data</div>
                ) : todos && todos.length > 0 ? (
                    todos.map(todo => (
                        <CategoryItem
                            key={todo.id}
                            category={todo}
                            onEditStart={handleEditStart}
                            onDelete={handleDeleteTodo}
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <h2 className="text-2xl text-gray-500">게시판을 추가하세요.</h2>
                    </div>
                )}
                {addingTodo && (
                    <div className="flex items-center justify-between p-4">
                        <input
                            type="text"
                            placeholder="할 일을 입력하세요."
                            value={newTodoTitle}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="border border-gray-300 px-2 py-1 rounded-md"
                        />
                        <div className="flex items-center space-x-2">
                            <CheckIcon className="text-green-500 cursor-pointer" onClick={handleConfirmAddTodo}/>
                            <XIcon className="text-red-500 cursor-pointer" onClick={handleCancelAddTodo}/>
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
