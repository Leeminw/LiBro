'use client'

import React, {useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
    contents?: string; // value를 선택적으로 만듦
    onChange: (content: string) => void; // 변경 콜백 함수 타입 정의
}

// 사용하고 싶은 옵션, 나열 되었으면 하는 순서대로 나열
const toolbarOptions = [
    ["link", "image", "video"],
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
];


// 옵션에 상응하는 포맷, 추가해주지 않으면 text editor에 적용된 스타일을 볼수 없음
const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "background",
    "color",
    "link",
    "image",
    "video",
    "width",
];

const modules = {
    toolbar: {
        container: toolbarOptions,
    },
};


export function Editor(props: EditorProps) {
    const { contents = '', onChange } = props; // props에서 value를 가져오고, 없을 경우 빈 문자열로 초기화

    const [value, setValue] = useState<string>(contents); // useState에 초기값을 지정

    useEffect(() => {
        setValue(contents); // 컴포넌트가 마운트될 때 contents 값 변경
    }, [contents]);

    const handleChange = (content: string) => {
        setValue(content);
        onChange(content); // 변경된 내용을 상위 컴포넌트로 전달
    };


    return (
        <ReactQuill
            theme="snow"
            value={value || ""}
            onChange={handleChange}
            style={{ height: "30vh", marginBottom: "40px" }}
            modules={modules}
            formats={formats}
        />
    );
}
