import CategoryList from "@/components/components/admin/BoardList";


export default function CategoryAdmin(){

    const data = [
        { id: 1, title: '게시판판' },
        { id: 2, title: '게시판' },
    ];

    return (
        <CategoryList props={data}/>
    )
}
