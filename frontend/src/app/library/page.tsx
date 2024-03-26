'use client'

import React, { useState, useEffect, useRef } from "react"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
  } from "@/components/ui/carousel"

import { useSearchParams } from "next/navigation"
interface User {
    profileUrl: string
    id: string,
    nickName: string,
    truename: string,
    birth: string
    readRate: number,
    bookRate: number,
}

interface Book {
    id: number;
    image: string;
    name: string;
    publisher: string;
    date: string;
    author: string;
    readstartdate: string | null;
    readcompletedate: string | null;
    complete: boolean;
    readrate: string;
    currentpage: number, 
    finalpage: number
  }

interface ModalProps {
    book: Book;
    onClose: () => void;
}

interface Review {
    review?: string;
    rating?: number;
    isSpoiler?: boolean;
    timestamp?: Date;
}


const Library = () => {
    const isbn = useSearchParams().get("isbn");
    console.log(isbn)
    const [user, setUser] = useState<User>({
        profileUrl: "https://github.com/shadcn.png",
        id: '',
        nickName: '11',
        truename: '',
        birth: '11',
        readRate: 0,
        bookRate: 1,
      });

    // 책 페이지
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12;
    const numberOfRows = 3; // 총 행의 수


    const [books, setBooks] = useState([
        { id: 1, isbn: 0, image: 'book1.svg', name: '니모를 찾아서', publisher: '바다출판사', date: '2023-01-04', author: '한명진', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: true, readrate: '100%', currentpage: 484, finalpage: 484},
        { id: 2, image: 'book2.svg', name: '우주 탐험', publisher: '별빛출판사', date: '2023-02-15', author: '김우주', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '42%', currentpage: 203, finalpage: 484},
        { id: 3, image: 'book3.svg', name: '코딩의 정석', publisher: '코드출판사', date: '2023-03-20', author: '이코더', readstartdate: 'null', readcompletedate: 'null', complete: false, readrate: '0%', currentpage: 0, finalpage: 484},
        { id: 4, image: 'book4.svg', name: '식물의 비밀', publisher: '자연출판사', date: '2023-04-10', author: '박식물', readstartdate: 'null', readcompletedate: 'null', complete: false, readrate: '0%', currentpage: 0, finalpage: 484},
        { id: 5, image: 'book5.svg', name: '역사 속으로', publisher: '시간여행출판사', date: '2023-05-05', author: '정역사', readstartdate: 'null', readcompletedate: 'null', complete: true, readrate: '0%', currentpage: 0, finalpage: 484},
        { id: 6, image: 'book1.svg', name: '꿈꾸는 다락방', publisher: '희망출판사', date: '2023-06-20', author: '이꿈꾸', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '12%', currentpage: 58, finalpage: 484},
        { id: 7, image: 'book2.svg', name: '자연 속으로', publisher: '대지출판사', date: '2023-07-05', author: '박자연', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: true, readrate: '100%', currentpage: 484, finalpage: 484},
        { id: 8, image: 'book3.svg', name: '우주의 미래', publisher: '과학출판사', date: '2023-07-18', author: '최우주', readstartdate: 'null', readcompletedate: 'null', complete: false, readrate: '0%', currentpage: 0, finalpage: 484},
        { id: 9, image: 'book4.svg', name: '인간 본성의 법칙', publisher: '심리출판사', date: '2023-08-01', author: '정인간', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '70%', currentpage: 339, finalpage: 484},
        { id: 10, image: 'book5.svg', name: '시간의 역사', publisher: '역사출판사', date: '2023-08-15', author: '홍시간', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '82%', currentpage: 397, finalpage: 484},
        { id: 11, image: 'book1.svg', name: '빛의 세계', publisher: '과학출판사', date: '2023-09-01', author: '김빛', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '65%', currentpage: 315, finalpage: 484},
        { id: 12, image: 'book2.svg', name: '컴퓨터 과학의 정석', publisher: '기술출판사', date: '2023-09-17', author: '이컴퓨터', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '45%', currentpage: 216, finalpage: 484},
        { id: 13, image: 'book3.svg', name: '심리학 입문', publisher: '심리출판사', date: '2023-10-02', author: '박심리', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '32%', currentpage: 156, finalpage: 484},
        { id: 14, image: 'book4.svg', name: '음악의 숨결', publisher: '소리출판사', date: '2023-12-05', author: '이음악', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '23%', currentpage: 111, finalpage: 484},
        { id: 15, image: 'book5.svg', name: '컴퓨터와 함께하는 하루', publisher: '기술출판사', date: '2023-07-20', author: '박컴퓨터', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '12%', currentpage: 59, finalpage: 484},
        { id: 16, image: 'book1.svg', name: '시간을 거슬러', publisher: '시간여행출판사', date: '2023-08-11', author: '정시간', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '11%', currentpage: 54, finalpage: 484},
        { id: 17, image: 'book2.svg', name: '지구 너머의 삶', publisher: '외계출판사', date: '2023-09-30', author: '한외계', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '12%', currentpage: 59, finalpage: 484},
        { id: 19, image: 'book4.svg', name: '세계사의 이해', publisher: '역사출판사', date: '2023-10-18', author: '최역사', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '1%', currentpage: 5, finalpage: 484},
        { id: 20, image: 'book5.svg', name: '미술의 이해', publisher: '예술출판사', date: '2023-11-01', author: '김미술', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: true, readrate: '100%', currentpage: 484, finalpage: 484},
        { id: 21, image: 'book1.svg', name: '미래의 문', publisher: '내일출판사', date: '2023-06-01', author: '김미래', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: false, readrate: '3%', currentpage: 16, finalpage: 484},
        { id: 22, image: 'book2.svg', name: '별에서 온 그대', publisher: '우주출판사', date: '2023-06-15', author: '별하늘', readstartdate: '2023-02-12', readcompletedate: '2023-03-14', complete: true, readrate: '100%', currentpage: 484, finalpage: 484},
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

    // const sliderRef = useRef(null);
    // const handleMouseDown = (e) => {
    //     const startX = e.pageX;
        
    //     const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    //         const endX = e.pageX;
    //         // 오른쪽에서 왼쪽으로 드래그 했을 때
    //         if (startX - endX > 50) {
    //             // 다음 페이지로 넘김
    //             setCurrentPage((prevPage) => Math.min(prevPage + 1, currentBooks.length / 4 - 1));
    //         }
    //         // 왼쪽에서 오른쪽으로 드래그 했을 때
    //         else if (endX - startX > 50) {
    //             // 이전 페이지로 넘김
    //             setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    //         }
            
    //         document.removeEventListener('mouseup', handleMouseUp);
    //     };
        
    //     document.addEventListener('mouseup', handleMouseUp);
    // };

 
    // 페이지 번호를 클릭했을 때 현재 페이지를 업데이트합니다.
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // 전체 페이지 수를 계산합니다.
    const pageNumbers: number[]= [];
    for (let i = 1; i <= Math.ceil(processedBooks.length / booksPerPage); i++) {
        pageNumbers.push(i);
    }

    // hover 제어
    const [hoveredBook, setHoveredBook] = useState(0);

    // 모달 상태와 선택된 책 정보를 관리하기 위한 상태 추가
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // 모달을 여는 함수
    const openModal = (book: Book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    // 모달을 닫는 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };

    const [rating, setRating] = useState(0); // 별점 상태 초기화
    const [isSpoiler, setIsSpoiler] = useState(false); // 스포일러 체크박스 상태
    const [review, setReview] = useState('');
    const [savedReview, setSavedReview] = useState<{ [key: number]: Review }>({});
    const [savedRating, setSavedRating] = useState(0); // 저장된 별점 상태 추가

    const BookModal = ({ book, onClose }: ModalProps) => {
        if (!book) return null;

        const renderStars = () => {
            let stars = [];
            for (let i = 1; i <= 5; i++) {
                stars.push(
                    <button
                        key={i}
                        onClick={() => setRating(i)} // 클릭 시 별점 상태 업데이트
                        className={`w-8 h-8 mx-0.5 ${rating >= i ? "fill-current text-[#FFCA28]" : "text-black"}`}
                    >
                        {rating >= i ? (
                            <StarFillIcon className="w-full h-full" />
                        ) : (
                            <StarEmptyIcon className="w-full h-full" />
                        )}
                    </button>
                );
            }
            return stars;
        };

        // 책의 독서 시작
        const startReading = () => {
            if (selectedBook) {
            const updatedBooks = books.map(book => {
                if (book.id === selectedBook.id) {
                return { ...book, readstartdate: new Date().toISOString(), complete: false };
                }
                return book;
            });
            setBooks(updatedBooks);
            setSelectedBook({ ...selectedBook, readstartdate: new Date().toISOString(), complete: false });
            }
        };

        // 독서 포기
        const giveUpReading = () => {
            if (selectedBook) {
            const updatedBooks = books.map(book => {
                if (book.id === selectedBook.id) {
                return { ...book, readstartdate: 'null', complete: false };
                }
                return book;
            });
            setBooks(updatedBooks);
            setSelectedBook({ ...selectedBook, readstartdate: 'null', complete: false });
            }
        };

        // 독서 완료
        const completeReading = () => {
            if (selectedBook) {
            const updatedBooks = books.map(book => {
                if (book.id === selectedBook.id) {
                return { ...book, readcompletedate: new Date().toISOString(), complete: true };
                }
                return book;
            });
            setBooks(updatedBooks);
            setSelectedBook({ ...selectedBook, readcompletedate: new Date().toISOString(), complete: true });
            }
        };

        const Header = () => {
            return (
              <div className="relative h-24">
                {/* 블러 처리된 배경 이미지 */}
                <div className="absolute inset-0 bg-cover bg-center blur-sm " 
                     style={{ backgroundImage: `url(${book.image})` }}>
                </div>
                <div className="absolute inset-0 bg-black opacity-30">
                    {/* 이 div는 검은색 반투명 오버레이 역할을 합니다. */}
                </div>
        
                {/* 선명한 책 이미지와 정보 */}
                <div className="relative flex items-start">
                    <Image src={book.image} alt="Book Cover" width={70} height={105} className="h-auto rounded shadow-lg my-6 ml-6" />
                    <div className="ml-4 mt-8">
                        <h2 className="text-white text-md font-bold">{book.name}</h2>
                        <div className="flex items-center mt-2">
                            <p className="text-xs text-gray-300">저자 {book.author} |</p>
                            <p className="text-xs text-gray-300 ml-1">출판사 {book.publisher}</p>
                        </div>
                        <div className="flex mt-6">
                            <Link href='/detail' className="text-[#9268EB] text-xs">도서 정보 보기 {'>'}</Link>
                        </div>
                        <Button className="absolute right-0 top-0 text-white" variant="ghost" onClick={onClose}>
                            <Image src="x-white.svg" alt='search' width={20} height={20}/>
                        </Button>
                    </div>
                </div>
              </div>
            );
        };

        const Record = () => {
            return (
                <div className="mx-6 mt-10">
                    <h1 className="text-xl font-bold mb-3">독서 기록</h1>
                    <div className="flex justify-start items-center">
                        <Button className="flex justify-start items-center font-bold text-xs text-gray-500 bg-white border border-gray-300 shadow-lg w-full ">
                        {selectedBook && (selectedBook.readstartdate === null || selectedBook.readstartdate === 'null') ? (
                            <p>독서 기록이 없습니다.</p>
                        ) : (
                            selectedBook && selectedBook.complete ? (
                                selectedBook.readcompletedate ? (
                                    <p>{`${new Date(selectedBook.readcompletedate).getFullYear()}년 ${new Date(selectedBook.readcompletedate).getMonth() + 1}월 ${new Date(selectedBook.readcompletedate).getDate()}일 독서 완료`}</p>
                                ) : (
                                    <p>독서 완료 날짜 정보가 없습니다.</p>
                                )
                            ) : (
                                selectedBook && selectedBook.readstartdate ? (
                                    <p>{`${new Date(selectedBook.readstartdate).getFullYear()}년 ${new Date(selectedBook.readstartdate).getMonth() + 1}월 ${new Date(selectedBook.readstartdate).getDate()}일부터 독서 중`}</p>
                                ) : (
                                    <p>독서 시작 날짜 정보가 없습니다.</p>
                                )
                            )
                        )}
                        </Button>
                    </div>
                </div>
            )
        }

    const Review = () => {

        const displaySavedRatingStars = (rating: number) => {
            let stars = [];
            for (let i = 1; i <= 5; i++) {
                stars.push(
                    <span key={i}>
                        {rating >= i ? (
                            <StarFillIcon className="w-4 h-4 text-[#FFCA28]" /> // 채워진 별
                        ) : (
                            <StarEmptyIcon className="w-4 h-4 text-gray-400" /> // 빈 별
                        )}
                    </span>
                );
            }
            return stars;
        };

        const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setIsSpoiler(event.target.checked); // 체크박스 상태 업데이트
        };

        const saveReview = () => {
            if (!selectedBook) return;
            // 현재 선택된 책의 ID를 사용하여 리뷰, 별점, 스포일러 여부, 저장 시간 저장
            const timestamp = new Date(); // 현재 시간
            setSavedReview(prevReview => ({
                ...prevReview,
                [selectedBook.id]: { review, rating, isSpoiler, timestamp }
            }));
            // 저장 후 입력 필드 초기화
            setReview('');
            setRating(0);
            setIsSpoiler(false);
        };

        const currentSavedReview = selectedBook ? savedReview[selectedBook.id] || {} : {};

        // 'YYYY/MM/DD 오후 HH:mm' 형식의 문자열로 시간을 변환하는 함수
        const formatTimestamp = (timestamp: Date | undefined) => {
            if (!timestamp) return 'Invalid date';
            
            let year = timestamp.getFullYear().toString();
            let month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
            let day = timestamp.getDate().toString().padStart(2, '0');
            let hour = timestamp.getHours();
            let minute = timestamp.getMinutes().toString().padStart(2, '0');
            
            let ampm = hour >= 12 ? '오후' : '오전';
            hour = hour % 12;
            hour = hour ? hour : 12; // 시간이 0이면 12로 변경
            let strHour = hour.toString().padStart(1, '0');
        
            return `${year}/${month}/${day} ${ampm} ${strHour}:${minute}`;
        };
        

        return (
            <div className="mx-6 mt-4">
                <h1 className="mb-3 text-xl font-bold">나의 평점</h1>
                {!currentSavedReview.review && (
                    <>
                        <div className="flex items-start justify-between mb-1">
                            <div className="mr-2 text-m font-bold">
                                {renderStars()}
                            </div>
                            <div className="flex">
                                <Input
                                    type="checkbox"
                                    id="spoilerCheckbox"
                                    checked={isSpoiler}
                                    onChange={handleCheckboxChange}
                                    className="w-3 h-3 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="spoilerCheckbox" className="ml-2 text-xs font-bold">스포일러 포함</label>
                            </div>
                        </div>  
                        <div className="flex items-center text-sm">
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="리뷰를 입력하세요."
                                className="w-5/6 p-2 mr-2 border rounded"
                            />
                            <Button onClick={saveReview} className="bg-[#9268EB] rounded-md p-0.5 w-12 h-12">
                                <Image src='mdi_pencil.svg' alt='pencil' width={30} height={30} />
                            </Button>
                        </div>
                    </>
                )}
                {/* 저장된 리뷰 보여주기 */}
                {currentSavedReview.review && (
                    <div className="rounded border border-gray-300 shadow-lg p-4">
                        <div className="flex justify-between">
                            <div className="flex mb-1">
                                <div className="text-sm font-bold mr-2">@{user.nickName} </div>
                                <div className="text-sm">{currentSavedReview.timestamp ? formatTimestamp(currentSavedReview.timestamp) : '날짜 정보 없음'}</div>
                            </div>
                            <Button className="bg-white text-xs text-gray-400 p-1 rounded-md h-6">수정하기</Button>
                        </div>   

                        <div className="flex items-center mb-1">{currentSavedReview.rating !== undefined ? displaySavedRatingStars(currentSavedReview.rating) : '평점 정보 없음'}</div>
                        <div className="text-sm mb-1">{currentSavedReview.review}</div>
                        {/* 여기에 별점과 스포일러 여부도 표시 */}
                        {currentSavedReview.isSpoiler && <div className="text-red-500">스포일러 포함</div>}
                    </div>
                )}
            </div>  
        );
    };

        const Sentence = () => {

            const [api, setApi] = useState<CarouselApi>()
            const [current, setCurrent] = useState(0)
            const [count, setCount] = useState(0)
            const [inputs, setInputs] = useState(['']); // 입력한 텍스트를 저장할 배열 상태를 추가
            const [currentInput, setCurrentInput] = useState('');

            useEffect(() => {
                if (!api) {
                return
                }
            
                setCount(api.scrollSnapList().length)
                setCurrent(api.selectedScrollSnap() + 1)
            
                api.on("select", () => {
                setCurrent(api.selectedScrollSnap() + 1)
                })
            }, [api])

            const handleSave = () => {
                const newInputs = [currentInput, ...inputs]; // 현재 입력한 텍스트를 inputs 배열에 추가
                setInputs(newInputs);
                setCurrentInput(''); // 입력 상태 초기화
                setCount(count+1)
            };
        
            const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setCurrentInput(e.target.value); // 입력 필드의 변경사항을 currentInput 상태에 반영
            };
    
            return (
                <div className="mx-6 mt-4 mb-2">
                    <div className="flex justify-between">
                        <h1 className="mb-3 text-xl font-bold">감명깊은 글귀</h1>
                        <Button onClick={handleSave} className="bg-[#9268EB] text-md text-white font-bold p-3 rounded-md h-8">저장</Button>
                    </div>
        
                    <div className="flex items-center justify-center">
                        <Carousel setApi={setApi} className="w-5/6">
                            <CarouselContent>
                                {inputs.map((input, index) => (
                                    <CarouselItem key={index}>
                                        <Card>
                                            <CardContent className="flex items-center justify-center p-3 h-24 text-xs">
                                                <textarea 
                                                    placeholder="여기에 글귀를 입력하세요" 
                                                    className="flex w-full p-2 justify-center items-center text-center h-full resize-none"
                                                    rows={4}
                                                    value={index === inputs.length - 1 ? currentInput : input}
                                                    onChange={handleInputChange}
                                                />
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                    <div className="py-2 text-center text-xs text-muted-foreground">
                        {current} / {count}
                    </div>
                </div>
            );
        }

            const ButtonComponent = () => {
                
                if (!selectedBook || selectedBook.readstartdate === 'null' || selectedBook.readstartdate === null) {
                    // 독서 기록이 없을 때
                    return (
                        <div className="flex justify-center"> 
                            <button className="w-full p-1.5 mx-6 text-center bg-[#9268EB] rounded-md" onClick={startReading}>
                                <div className=" text-white  ">독서 기록 시작하기</div>
                            </button>
                        </div>
                    );
                } else if (selectedBook.complete) {
                    // 독서 완료일 때
                    return (
                        <div className="flex justify-center"> 
                            <button className="w-full p-1.5 mx-6 text-center bg-[#9268EB] rounded-md" onClick={startReading}>
                                <div className=" text-white  ">독서 기록 다시 시작하기</div>
                            </button>
                        </div>
                    );
                } else {
                    // 독서 중일 때
                    return (
                        <div className="flex justify-center mx-6"> 
                            <button className="w-full bg-[#F87171] text-white p-1.5 rounded-md mr-4" onClick={giveUpReading}>독서 포기</button>
                            <button className="w-full bg-[#9268EB] text-white p-1.5  rounded-md" onClick={completeReading }>완독</button>
                        </div>
                    );
                }
            };
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-md w-1/2 h-3/4 overflow-y-auto">
                    <Header />
                    <Record />
                    <Review />
                    <Sentence />
                    <ButtonComponent/>
                </div>
            </div>
        );
    };

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
                    
                    <div className="grid grid-cols-4 " >
                        {currentBooks.map((book, index) => (
                            <div key={index} className="group relative my-2 pt-2 pb-2 px-2 shadow border-b-4 border-white"
                                onMouseEnter={() => setHoveredBook(index)}
                                onMouseLeave={() => setHoveredBook(-99)}
                                onClick={() => openModal(book)}>
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

                    {isModalOpen && selectedBook && <BookModal book={selectedBook} onClose={closeModal} />}
                    
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

function StarFillIcon(props : any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#FFCA28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
  
  function StarEmptyIcon(props : any) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="white"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    }