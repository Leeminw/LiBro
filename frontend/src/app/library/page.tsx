'use client'

import React, { useState, useEffect } from "react"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const Library = () => {

    // 책 페이지
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12;
    const numberOfRows = 3; // 총 행의 수

    const [books, setBooks] = useState([
        { image: 'book1.svg', name: '니모를 찾아서', publisher: '바다출판사', date: '2023-01-04', author: '한명진', readdate: '2023-02-12', complete: true, readrate: '100%', currentpage: 484, finalpage: 484},
        { image: 'book2.svg', name: '우주 탐험', publisher: '별빛출판사', date: '2023-02-15', author: '김우주', readdate: '2023-02-12', complete: false, readrate: '42%', currentpage: 203, finalpage: 484},
        { image: 'book3.svg', name: '코딩의 정석', publisher: '코드출판사', date: '2023-03-20', author: '이코더', readdate: 'null', complete: false, readrate: '10%', currentpage: 48, finalpage: 484},
        { image: 'book4.svg', name: '식물의 비밀', publisher: '자연출판사', date: '2023-04-10', author: '박식물', readdate: 'null', complete: false, readrate: '3%', currentpage: 15, finalpage: 484},
        { image: 'book5.svg', name: '역사 속으로', publisher: '시간여행출판사', date: '2023-05-05', author: '정역사', readdate: 'null', complete: true, readrate: '100%', currentpage: 484, finalpage: 484},
        { image: 'book1.svg', name: '꿈꾸는 다락방', publisher: '희망출판사', date: '2023-06-20', author: '이꿈꾸', readdate: '2023-02-12', complete: false, readrate: '12%', currentpage: 58, finalpage: 484},
        { image: 'book2.svg', name: '자연 속으로', publisher: '대지출판사', date: '2023-07-05', author: '박자연', readdate: '2023-02-12', complete: true, readrate: '100%', currentpage: 484, finalpage: 484},
        { image: 'book3.svg', name: '우주의 미래', publisher: '과학출판사', date: '2023-07-18', author: '최우주', readdate: 'null', complete: false, readrate: '1%', currentpage: 5, finalpage: 484},
        { image: 'book4.svg', name: '인간 본성의 법칙', publisher: '심리출판사', date: '2023-08-01', author: '정인간', readdate: '2023-02-12', complete: false, readrate: '70%', currentpage: 339, finalpage: 484},
        { image: 'book5.svg', name: '시간의 역사', publisher: '역사출판사', date: '2023-08-15', author: '홍시간', readdate: '2023-02-12', complete: false, readrate: '82%', currentpage: 397, finalpage: 484},
        { image: 'book1.svg', name: '빛의 세계', publisher: '과학출판사', date: '2023-09-01', author: '김빛', readdate: '2023-02-12', complete: false, readrate: '65%', currentpage: 315, finalpage: 484},
        { image: 'book2.svg', name: '컴퓨터 과학의 정석', publisher: '기술출판사', date: '2023-09-17', author: '이컴퓨터', readdate: '2023-02-12', complete: false, readrate: '45%', currentpage: 216, finalpage: 484},
        { image: 'book3.svg', name: '심리학 입문', publisher: '심리출판사', date: '2023-10-02', author: '박심리', readdate: '2023-02-12', complete: false, readrate: '32%', currentpage: 156, finalpage: 484},
        { image: 'book4.svg', name: '음악의 숨결', publisher: '소리출판사', date: '2023-12-05', author: '이음악', readdate: '2023-02-12', complete: false, readrate: '23%', currentpage: 111, finalpage: 484},
        { image: 'book5.svg', name: '컴퓨터와 함께하는 하루', publisher: '기술출판사', date: '2023-07-20', author: '박컴퓨터', readdate: '2023-02-12', complete: false, readrate: '12%', currentpage: 59, finalpage: 484},
        { image: 'book1.svg', name: '시간을 거슬러', publisher: '시간여행출판사', date: '2023-08-11', author: '정시간', readdate: '2023-02-12', complete: false, readrate: '11%', currentpage: 54, finalpage: 484},
        { image: 'book2.svg', name: '지구 너머의 삶', publisher: '외계출판사', date: '2023-09-30', author: '한외계', readdate: '2023-02-12', complete: false, readrate: '12%', currentpage: 59, finalpage: 484},
        { image: 'book4.svg', name: '세계사의 이해', publisher: '역사출판사', date: '2023-10-18', author: '최역사', readdate: '2023-02-12', complete: false, readrate: '1%', currentpage: 5, finalpage: 484},
        { image: 'book5.svg', name: '미술의 이해', publisher: '예술출판사', date: '2023-11-01', author: '김미술', readdate: '2023-02-12', complete: true, readrate: '100%', currentpage: 484, finalpage: 484},
        { image: 'book1.svg', name: '미래의 문', publisher: '내일출판사', date: '2023-06-01', author: '김미래', readdate: '2023-02-12', complete: false, readrate: '3%', currentpage: 16, finalpage: 484},
        { image: 'book2.svg', name: '별에서 온 그대', publisher: '우주출판사', date: '2023-06-15', author: '별하늘', readdate: '2023-02-12', complete: true, readrate: '100%', currentpage: 484, finalpage: 484},
    ]);

    // 검색어를 업데이트하는 함수입니다.
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const [arrange, setArrange] = useState('');

    // 정렬과 검색을 모두 적용한 책 목록
    const [processedBooks, setProcessedBooks] = useState([...books]);
    
    // 검색과 정렬이 모두 반영되어야 하므로, useEffect를 사용해 두 상태의 변화를 감지합니다.
    useEffect(() => {
        // 먼저, 검색 적용
        let updatedBooks = books.filter(book =>
            book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        // 그 다음, 정렬 적용
        switch(arrange) {
            case '책 제목 순':
                updatedBooks.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
                break;
            case '저자명 순':
                updatedBooks.sort((a, b) => a.author.localeCompare(b.author, 'ko'));
                break;
            case '출판사 순':
                updatedBooks.sort((a, b) => a.publisher.localeCompare(b.publisher, 'ko'));
                break;
            case '최근 발행 순':
                updatedBooks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
            // 기본 정렬 로직 또는 기본값 설정이 필요할 경우 추가
        }
    
        // 최종적으로 처리된 책 목록을 상태에 저장
        setProcessedBooks(updatedBooks);
    }, [searchTerm, arrange, books]);
    

    // 현재 페이지에 보여줄 책들을 계산합니다.
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = processedBooks.slice(indexOfFirstBook, indexOfLastBook);
 
    // 페이지 번호를 클릭했을 때 현재 페이지를 업데이트합니다.
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // 전체 페이지 수를 계산합니다.
    const pageNumbers: number[]= [];
    for (let i = 1; i <= Math.ceil(processedBooks.length / booksPerPage); i++) {
        pageNumbers.push(i);
    }

    const [hoveredBook, setHoveredBook] = useState(0);

    return (
        <div className="bg-white h-full pt-12 overflow-auto ">
            <div className="pt-4 mb-3 px-3">
                <div className="text-xl font-bold ml-2 ">나의 서재</div>
            </div>
            <div className="flex justify-between items-center bg-black opacity-70 pl-3 py-3 text-white text-sm">
                <div className="pl-3">
                    전체 {books.length}권
                </div>
                <div className='flex justify-between pr-2'>
                    <Select onValueChange={(value) => setArrange(value)}>
                        <SelectTrigger id="arrangeSelect" style={{ backgroundColor: 'black', color: 'white', borderColor: 'black', width: '100%', height: '20%'}}>
                            <SelectValue placeholder="최근 담은 순" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="최근 담은 순" >최근 담은 순</SelectItem>
                            <SelectItem value="책 제목 순">책 제목 순</SelectItem>
                            <SelectItem value="저자명 순">저자명 순</SelectItem>
                            <SelectItem value="출판사 순">출판사 순</SelectItem>
                            <SelectItem value="최근 발행 순">최근 발행 순</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="bg-bg-svg p-3">
                <div className="flex items-center justify-between rounded-lg px-3 mx-3 bg-white h-10">
                <Input 
                  value={searchTerm}
                  className="flex-1 border-none h-10 py-2" 
                  placeholder="제목, 작가, 출판사 등으로 검색" 
                  onChange={handleSearch} />
                    <div className="flex items-center">
                        <Button className="text-gray-500 border-r border-gray-500 rounded-none px-2 py-2 h-6" variant="ghost" onClick={() => setSearchTerm('')}>
                            <Image src="xd.svg" alt='search' width={14} height={14}/>
                        </Button>
                        <Button className="text-gray-500 px-2 py-2 h-6" variant="ghost">
                            <Image src="search1.svg" alt='search' width={16} height={16}/>
                        </Button>
                    </div>
                </div>
                <div className="p-1">
                    <div className="grid grid-cols-4 "> {/* 배경을 적용할 부분에 bg-bg-svg 클래스 추가 */}
                        {currentBooks.map((book, index) => (
                            <div key={index} className="group relative my-2 pt-2 pb-2 px-2 shadow border-b-4 border-white"
                                onMouseEnter={() => setHoveredBook(index)}
                                onMouseLeave={() => setHoveredBook(-99)}> 
                                <div className={`w-full h-full ${book.complete ? 'ring ring-green-400' : ''}`}> {/* overflow-hidden 추가 */}
                                    <Image src={`/${book.image}`} alt={`Book ${index + 1}`} width={100} height={150} layout="responsive" /> {/* object-cover 추가 */}
                                </div>
                                {hoveredBook === index && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-start" >
                                        <div>
                                            <p className="text-white text-sm mx-2 my-6 ">{book.name}</p>
                                        </div>
                                        <div className="absolute top-12 left-0  flex justify-start">
                                            <p className="text-white text-sm mx-2 my-6 ">{book.complete ? '' : `진행률: ${book.readrate}`}</p>
                                        </div>
                                        <div className="absolute top-16 left-0 flex justify-start">
                                            <p className="text-white text-sm mx-2 my-6 ">{book.complete ? '' : `${book.currentpage} / ${book.finalpage}`}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* 책의 수가 최대 페이지 수에 미치지 못할 경우, 빈 자리를 채우기 위한 처리 */}
                        {Array.from({ length: 12 - currentBooks.length }, (_, index) => (
                            <div key={`empty-${index}`} className="my-2 p-1 shadow border-b-4 border-white w-33 h-33 flex justify-center items-center">
                            
                            </div>
                        ))}
                    </div>
                    <nav>
                        <ul className='pagination flex items-center justify-center'>
                            {pageNumbers.map(number => (
                                <li key={number} className={`page-item mx-1 ${currentPage === number ? 'text-white font-bold' : 'text-gray-400'}`}>
                                    <a onClick={(e) => { e.preventDefault(); paginate(number); }} href="#" className='page-link'>
                                        {number}
                                    </a>
                                </li>
                            ))}
                            {pageNumbers.length > 0 && (
                                <li className='page-item mx-1 text-white font-bold'>
                                    <a onClick={(e) => { e.preventDefault(); paginate(pageNumbers[pageNumbers.length - 1]); }} href="#" className='page-link'>
                                        {'->'}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Library;
