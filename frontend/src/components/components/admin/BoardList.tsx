'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileEditIcon, TrashIcon, CheckIcon, XIcon } from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";

interface Todo {
    id: number;
    title: string;
}

interface CategoryItemProps {
    todo: Todo;
    onEditStart: (id: number, newTitle: string) => void;
    onDelete: (id: number) => void;
}

function CategoryItem({ todo, onEditStart, onDelete }: CategoryItemProps) {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(todo.title);

    const handleEditStart = () => {
        setEditing(true);
    };

    const handleEditFinish = () => {
        setEditing(false);
        onEditStart(todo.id, inputValue);
    };

    const handleEditCancel = () => {
        setEditing(false);
        setInputValue(todo.title);
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
                    <h2 className="text-lg cursor-pointer" onClick={handleEditStart}>{todo.title}</h2>
                    <div className="flex items-center space-x-2">
                        <FileEditIcon className="text-gray-600 cursor-pointer" onClick={handleEditStart} />
                        <TrashIcon className="text-gray-600 cursor-pointer" onClick={() => onDelete(todo.id)} />
                    </div>
                </>
            )}
        </div>
    );
}

interface CategoryListProps {
    props: Todo[];
}

export default function CategoryList({ props }: CategoryListProps) {
    const [addingTodo, setAddingCategory] = useState(false);
    const [newTodoTitle, setNewCategory] = useState('');
    const [todos, setTodos] = useState(props); // setTodos 추가
    const [showAddBoard, setShowAddBoard] = useState(!(todos && todos.length > 0));

    const handleAddTodo = () => {
        setAddingCategory(true);
    };

    const handleConfirmAddTodo = () => {
        if (newTodoTitle.trim() !== '') {
            const newTodo = {
                id: todos.length + 1,
                title: newTodoTitle
            };
            setTodos([...todos, newTodo]);
            setAddingCategory(false);
            setNewCategory('');
        }
    };

    const handleCancelAddTodo = () => {
        setAddingCategory(false);
        setNewCategory('');
    };

    const handleEditStart = (id: number, newTitle: string) => {
        const updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, title: newTitle };
            }
            return todo;
        });
        setTodos(updatedTodos);
    };

    const handleDeleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="flex flex-col bg-white">
            <div className="flex justify-end p-4">
                <Button onClick={handleAddTodo} className="bg-purple-600 text-white">추가</Button>
            </div>


            <ScrollArea className="flex flex-col bg-white h-[calc(90vh-120px)]">
                {todos && todos.length > 0 ? (
                    todos.map(todo => (
                        <CategoryItem
                            key={todo.id}
                            todo={todo}
                            onEditStart={handleEditStart}
                            onDelete={handleDeleteTodo}
                        />
                    ))
                ) : (
                    // todos가 없으면 새로운 보드 추가 화면 표시
                    showAddBoard ? (
                        <div className="flex items-center justify-center h-full">
                            <h2 className="text-2xl text-gray-500">게시판을 추가하세요.</h2>
                        </div>
                    ) : null
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
