import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import React, {useState, useEffect} from "react";

interface User {
    profileUrl: string
    id: string,
    nickName: string,
    truename: string,
    birth: string
    readRate: number,
    bookRate: number,
    registeredBooks: number,
    completedBooks: number,
    sentencedBooks: number,
}

interface Modal {
    isOpen: boolean;
    isClose: () => void;
    children: any
}

function ChevronRightIcon(props : any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}

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
            fill="#E5E7EB"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}


const renderStars = (rate : number) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rate >= i) {
            stars.push(<StarFillIcon className="text-[#FFCA28] w-8 h-8" key={i} />);
        } else if (rate > i - 1 && rate < i) {
            // 별점이 반 별을 필요로 하는 경우 (예: 2.5)
            const percentageFull = (rate - i + 1) * 100;
            stars.push(
                <div className="relative w-8 h-8" key={i}>
                    <StarEmptyIcon className="text-[#E5E7EB] absolute top-0 left-0 w-8 h-8" />
                    <div className="overflow-hidden absolute top-0 left-0" style={{ width: `${percentageFull}%` }}>
                        <StarFillIcon className="text-[#FFCA28] w-8 h-8" />
                    </div>
                </div>
            );
        } else {
            stars.push(<StarEmptyIcon className="text-[#E5E7EB] w-8 h-8" key={i} />);
        }
    }
    return stars;
};


export default function Myinfo() {
    const [user, setUser] = useState<User>({
        profileUrl: "https://github.com/shadcn.png",
        id: '',
        nickName: '11',
        truename: '',
        birth: '11',
        readRate: 0,
        bookRate: 1,
        registeredBooks: 41,
        completedBooks: 23,
        sentencedBooks: 31,
    });

    const [bookRate, setBookRate] = useState(4.0) // 책 평점
    const [reviews, setReviews] = useState(0)

// 완독한 책의 수와 총 책의 수
    const [rateOneBooks, setRateOneBooks] = useState(1)
    const [rateTwoBooks, setRateTwoBooks] = useState(4)
    const [rateThreeBooks, setRateThreeBooks] = useState(7)
    const [rateFourBooks, setRateFourBooks] = useState(6)
    const [rateFiveBooks, setRateFiveBooks] = useState(15)

// 임시 닉네임 상태
    const [tempNickName, setTempNickName] = useState(user.nickName);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function Modal({ isOpen, isClose, children }: Modal) {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded w-3/7">
                    {children}
                    <div className="flex justify-around">
                        <Button onClick={handleUpdateAndClose} className="w-1/3 h-1/4 mt-4 bg-[#9268EB] font-bold">수정</Button>
                        <Button onClick={isClose} className="w-1/3 h-1/4 mt-4 bg-[#A4A4A4] font-bold">닫기</Button>
                    </div>
                </div>
            </div>
        );
    }

    // 모달 제어 함수
    const openModal = () => {
        setIsModalOpen(true);
        setTempNickName(user.nickName);
    };
    const isClose = () => setIsModalOpen(false);

// 유저 정보 업데이트 함수
    const updateUser = (updates: Partial<User>) => setUser({ ...user, ...updates });

// 닉네임 임시 변경 핸들러
    const handleTempNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempNickName(event.target.value); // 추출한 값을 사용하여 상태 업데이트
    };

// 닉네임 업데이트 및 모달 닫기
    const handleUpdateAndClose = () => {
        updateUser({ nickName: tempNickName });
        isClose();
    };

    useEffect(() => {
        // 완독율 계산 후 상태 업데이트
        const newReadRate = parseFloat((user.completedBooks / user.registeredBooks * 100).toFixed(0));
        setUser(prevUser => ({
          ...prevUser,
          readRate: newReadRate,
        }));
      }, [user.completedBooks, user.registeredBooks]); // user.completedBooks 또는 user.registeredBooks가 변경될 때마다 실행
      
    
    useEffect(() => {
    // 책 평점 계산 후 상태 업데이트
        const newRate1Books = parseFloat((rateOneBooks / user.registeredBooks * 100).toFixed(0));
        const newRate2Books = parseFloat((rateTwoBooks / user.registeredBooks * 100).toFixed(0));
        const newRate3Books = parseFloat((rateThreeBooks / user.registeredBooks * 100).toFixed(0));
        const newRate4Books = parseFloat((rateFourBooks / user.registeredBooks * 100).toFixed(0));
        const newRate5Books = parseFloat((rateFiveBooks / user.registeredBooks * 100).toFixed(0));
        setRateFiveBooks(newRate5Books);
        setRateFourBooks(newRate4Books);
        setRateThreeBooks(newRate3Books);
        setRateTwoBooks(newRate2Books);
        setRateOneBooks(newRate1Books);
    }, []);
    
    return (
        <>
            <div className="mt-4 pb-3 flex w-full border-b border-gray-300">
                <div className="w-1/3 flex justify-center items-center">
                    <div>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.profileUrl} alt="@defaultUser"/>
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                        <Button className="mt-4 bg-[#9268EB] text-white font-bold hover:bg-[#9268EB] hover:text-current"
                                onClick={openModal} variant="secondary">
                            프로필 수정
                        </Button>
                        <Modal isOpen={isModalOpen} isClose={isClose}>
                            <div className='font-bold border-b border-gray-400 pb-2 p-0'>프로필 수정</div>
                            <div className='flex justify-center items-center w-full'>
                                <div className="relative"> {/* 여기에 relative 추가 */}
                                    <Avatar className="h-16 w-16 mt-2">
                                        <AvatarImage src={user.profileUrl || "https://github.com/shadcn.png"}
                                                     alt="@defaultUser"/>
                                        <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                    <Button
                                        className="absolute bottom-0 right-0 bg-[#9268EB] rounded-full p-0.5 w-6 h-6"> {/* 배경 동그라미와 위치 조정 */}
                                        <Image src='mdi_pencil.svg' alt='pencil' width={20} height={20}
                                               className="bg-[#9268EB] rounded-full"/>
                                    </Button>
                                </div>
                            </div>
                            <div className="mx-10">
                                <Input
                                    className="border-white border-b-black text-center text-black font-bold rounded-none"
                                    value={tempNickName} // 임시 닉네임 상태를 사용
                                    placeholder="닉네임을 입력하세요"
                                    onChange={handleTempNickNameChange} // 임시 닉네임 변경을 처리하는 함수를 연결
                                />
                            </div>
                        </Modal>
                    </div>
                </div>
                <div className="w-2/3 justify-center mt-2">
                    <div className="mb-6 grid grid-cols-12 gap-4 pl-2">
                        <div className="text-sm text-gray-500 font-bold col-span-4 ">계정</div>
                        <div className="text-sm text-gray-500 col-span-8">{user.id}</div>
                    </div>
                    <div className="mb-6 grid grid-cols-12 gap-4 pl-2">
                        <div className="text-sm text-gray-500 font-bold col-span-4">닉네임</div>
                        <div className="text-sm text-gray-500 col-span-8">{user.nickName}</div>
                    </div>
                    <div className="mb-6 grid grid-cols-12 gap-4 pl-2">
                        <div className="text-sm text-gray-500 font-bold col-span-4">이름</div>
                        <div className="text-sm text-gray-500 col-span-8">{user.truename}</div>
                    </div>
                    <div className="mb-1 grid grid-cols-12 gap-4 pl-2">
                        <div className="text-sm text-gray-500 font-bold col-span-4">생년월일</div>
                        <div className="text-sm text-gray-500 col-span-8">{user.birth}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="mt-4">
                    <div className="text-xl font-bold ml-2 mr-2">분석</div>
                </div>

                <div
                    className="grid grid-cols-3 gap-4 items-center mt-3 mb-3 pb-3 pt-3 border-b border-t border-gray-300">
                    <div
                        className="flex flex-row items-center justify-center space-x-2 col-span-1 border-r border-gray-300">
                        <div className="text-sm font-bold">담은 책 수</div>
                        <div className="text-xs">{user.registeredBooks}</div>
                    </div>
                    <div
                        className="flex flex-row items-center justify-center space-x-2 col-span-1 border-l border-r border-gray-300">
                        <div className="text-sm font-bold">책 완독 수</div>
                        <div className="text-xs">{user.completedBooks}</div>
                    </div>
                    <div
                        className="flex flex-row items-center justify-center space-x-2 col-span-1 border-l border-gray-300">
                        <div className="text-sm font-bold">기록 글귀 수</div>
                        <div className="text-xs">{user.sentencedBooks}</div>
                    </div>
                </div>
            </div>

            <div className="ml-2 mr-2">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">완독율</div>
                    <div className="text-sm font-bold text-gray-500">{user.readRate}%</div>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded h-2">
                    <div
                        className="bg-[#9268EB] h-2 rounded"
                        style={{width: `${user.readRate}%`}}
                    ></div>
                </div>
            </div>

            <div className="ml-2 mr-2 mt-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">나의 평균 평점</div>
                    <div className="flex items-center">
                        <div className="mr-2 text-m font-bold">{bookRate}</div>
                        {renderStars(bookRate)}
                    </div>
                    <div className="flex items-center">
                        <div className="text-xs font-bold pl-3 pr-3">리뷰 수 {reviews}</div>
                    </div>
                </div>

                <div className="mt-3 text-center">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm mr-1">5</div>
                        <StarFillIcon className="text-[#FFCA28] w-4 h-4 mr-1"/>
                        <div className="w-full bg-[#E5E7EB] rounded h-1.5" style={{width: '320px'}}>
                            <div
                                className="bg-[#FFCA28] h-1.5 rounded"
                                style={{width: `${rateFiveBooks}%`}}
                            ></div>
                        </div>
                        <div className="w-13 pl-1 pr-1 text-center ">
                            <div className="text-sm ">{rateFiveBooks}%</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm mr-1">4</div>
                        <StarFillIcon className="text-[#FFCA28] w-4 h-4 mr-1"/>
                        <div className="w-full bg-[#E5E7EB] rounded h-1.5" style={{width: '320px'}}>
                            <div
                                className="bg-[#FFCA28] h-1.5 rounded"
                                style={{width: `${rateFourBooks}%`}}
                            ></div>
                        </div>
                        <div className="w-13 pl-1 pr-1 text-center ">
                            <div className="text-sm ">{rateFourBooks}%</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm mr-1">3</div>
                        <StarFillIcon className="text-[#FFCA28] w-4 h-4 mr-1"/>
                        <div className="w-full bg-[#E5E7EB] rounded h-1.5" style={{width: '320px'}}>
                            <div
                                className="bg-[#FFCA28] h-1.5 rounded"
                                style={{width: `${rateThreeBooks}%`}}
                            ></div>
                        </div>
                        <div className="w-13 pl-1 pr-1 text-center ">
                            <div className="text-sm ">{rateThreeBooks}%</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm mr-1">2</div>
                        <StarFillIcon className="text-[#FFCA28] w-4 h-4 mr-1"/>
                        <div className="w-full bg-[#E5E7EB] rounded h-1.5" style={{width: '320px'}}>
                            <div
                                className="bg-[#FFCA28] h-1.5 rounded"
                                style={{width: `${rateTwoBooks}%`}}
                            ></div>
                        </div>
                        <div className="w-13 pl-1 pr-1 text-center ">
                            <div className="text-sm">{rateTwoBooks}%</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm">1</div>
                        <StarFillIcon className="text-[#FFCA28] w-4 h-4"/>
                        <div className="w-full bg-[#E5E7EB] rounded h-1.5" style={{width: '320px'}}>
                            <div
                                className="bg-[#FFCA28] h-1.5 rounded"
                                style={{width: `${rateOneBooks}%`}}
                            ></div>
                        </div>
                        <div className="w-13 pl-1 pr-1 text-center ">
                            <div className="text-sm">{rateOneBooks}%</div>
                        </div>
                    </div>

                    <Button
                        className="flex justify-between items-center mt-4 font-bold text-[#F24E1E] bg-white border border-gray-300 shadow-lg w-full">
                        <div className="flex">
                            <Image src='vector.svg' width={20} height={20} alt='vector' className="mr-2"/>
                            로그아웃
                        </div>
                        <div className="flex">
                            <ChevronRightIcon className="text-gray-400"/>
                        </div>
                    </Button>

                </div>

            </div>
        </>

    );
}