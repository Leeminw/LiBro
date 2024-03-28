'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {useQueries} from "@tanstack/react-query";
import {getCompleteBookList, getCompleteRatio, getUserInform, getWrittenComment} from "@/lib/axiois-mypage";
import useUserState from "@/lib/login-state";
import {useRouter} from "next/navigation";
import {toast} from "@/components/ui/use-toast";
import {Progress} from "@/components/ui/progress";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger} from "@/components/ui/dialog";

interface Modal {
    isOpen: boolean;
    isClose: () => void;
    children: any
}

function StarFillIcon(props: any) {
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
            <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    )
}

function StarEmptyIcon(props: any) {
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
            <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    )
}


const renderStars = (rate: number) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rate >= i) {
            stars.push(<StarFillIcon className="text-[#FFCA28] w-8 h-8" key={i}/>);
        } else if (rate > i - 1 && rate < i) {
            // 별점이 반 별을 필요로 하는 경우 (예: 2.5)
            const percentageFull = (rate - i + 1) * 100;
            stars.push(
                <div className="relative w-8 h-8" key={i}>
                    <StarEmptyIcon className="text-[#E5E7EB] absolute top-0 left-0 w-8 h-8"/>
                    <div className="overflow-hidden absolute top-0 left-0" style={{width: `${percentageFull}%`}}>
                        <StarFillIcon className="text-[#FFCA28] w-8 h-8"/>
                    </div>
                </div>
            );
        } else {
            stars.push(<StarEmptyIcon className="text-[#E5E7EB] w-8 h-8" key={i}/>);
        }
    }
    return stars;
};


export default function Myinfo() {
    const {getUserInfo, deleteUserInfo} = useUserState();
    const userId = getUserInfo().id;
    const router = useRouter();

    const results = useQueries({
        queries: [
            {
                queryKey: ['myinfo'],
                queryFn: () => getUserInform(userId)
            },
            {
                queryKey: ['myReadCompleteRatio'],
                queryFn: () => getCompleteRatio()
            },
            {
                queryKey: ['myReadCompleteList'],
                queryFn: () => getCompleteBookList()
            },
            {
                queryKey: ['myWrittenComment'],
                queryFn: () => getWrittenComment()
            },
        ]
    });


// isLoading, hasError, isSuccess 는 기존 코드와 동일합니다.
    const isLoading = results.some((query) => query.isLoading);
    const hasError = results.some((query) => query.isError);
    const isSuccess = results.every((query) => query.isSuccess);


// 임시 닉네임 상태
    const [tempNickName, setTempNickName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    function Modal({isOpen, isClose, children}: Modal) {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded w-3/7">
                    {children}
                    <div className="flex justify-around">
                        <Button onClick={handleUpdateAndClose}
                                className="w-1/3 h-1/4 mt-4 bg-[#9268EB] font-bold">수정</Button>
                        <Button onClick={isClose} className="w-1/3 h-1/4 mt-4 bg-[#A4A4A4] font-bold">닫기</Button>
                    </div>
                </div>
            </div>
        );
    }


    // 모달 제어 함수
    const openModal = () => {
        setIsModalOpen(true);
        setTempNickName("");
    };
    const isClose = () => setIsModalOpen(false);

// 유저 정보 업데이트 함수
//     const updateUser = (updates: Partial<User>) => setUser({ ...user, ...updates });

// 닉네임 임시 변경 핸들러
    const handleTempNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempNickName(event.target.value); // 추출한 값을 사용하여 상태 업데이트
    };

// 닉네임 업데이트 및 모달 닫기
    const handleUpdateAndClose = () => {
        // updateUser({ nickName: tempNickName });
        isClose();
    };

    const logout = () => {
        deleteUserInfo();
        router.push("/");
        toast({
            title: "로그아웃",
            description: `정상적으로 로그아웃 되었습니다.`,
        });
    }


    if (isLoading) return <>Loading...</>;
    if (hasError) return <>Error</>;

    const [userInfo, completeRatio, bookReviews, writtenComment] = results.map(result => result.data);

    const reviewList = bookReviews && bookReviews.map((r: {
        rating: number;
    }) => r.rating).filter((r: null | number) => r !== null);
    const reviewCount = reviewList.length;
    console.log(reviewCount)

    return isSuccess && (
        <>
            <div className="mt-4 pb-3 flex w-full border-b border-gray-300">
                <div className="w-1/3 flex justify-center items-center">
                    <div>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={userInfo.profile} alt="@defaultUser"/>
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    className="mt-4 bg-[#9268EB] text-white font-bold hover:bg-[#9268EB] hover:text-current">Edit
                                    Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="">
                                <DialogHeader>프로필 수정</DialogHeader>
                                <div className='flex justify-center items-center w-full'>
                                    <div className="relative"> {/* 여기에 relative 추가 */}
                                        <Avatar className="h-16 w-16 mt-2">
                                            <AvatarImage src={userInfo.profile}
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
                                <DialogFooter>
                                    <Button type="submit">수정하기</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="w-2/3 justify-center mt-2">
                    <div className="mb-6 grid grid-cols-12 gap-4 pl-2">
                        <div className="text-sm text-gray-500 font-bold col-span-4 ">계정</div>
                        <div className="text-sm text-gray-500 col-span-8">{userInfo.email}</div>
                    </div>
                    <div className="mb-6 grid grid-cols-12 gap-4 pl-2">
                        <div className="text-sm text-gray-500 font-bold col-span-4">닉네임</div>
                        <div className="text-sm text-gray-500 col-span-8">{userInfo.nickName}</div>
                    </div>
                    <div className="mb-6 grid grid-cols-12 gap-4 pl-2">
                        <div className="text-sm text-gray-500 font-bold col-span-4">이름</div>
                        <div className="text-sm text-gray-500 col-span-8">{userInfo.name}</div>
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
                        <div className="text-xs">{completeRatio.totalSize}</div>
                    </div>
                    <div
                        className="flex flex-row items-center justify-center space-x-2 col-span-1 border-l border-r border-gray-300">
                        <div className="text-sm font-bold">책 완독 수</div>
                        <div className="text-xs">{completeRatio.readSize}</div>
                    </div>
                    <div
                        className="flex flex-row items-center justify-center space-x-2 col-span-1 border-l border-gray-300">
                        <div className="text-sm font-bold">기록 글귀 수</div>
                        <div className="text-xs">{writtenComment.reduce((total: number, dto: {
                            commentList: UserBookCommentDetailResponse[];
                        }) => {
                            return total + dto.commentList.length;
                        }, 0)}</div>
                    </div>
                </div>
            </div>

            <div className="ml-2 mr-2">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">완독율</div>
                    <div
                        className="text-sm font-bold text-gray-500">{completeRatio.totalSize === 0 ? 0 : ((completeRatio.readSize / completeRatio.totalSize) * 100).toFixed(1)} %
                    </div>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded h-2">
                    <div
                        className="bg-[#9268EB] h-2 rounded"
                        style={{width: `${completeRatio.totalSize === 0 ? 0 : ((completeRatio.readSize / completeRatio.totalSize) * 100).toFixed(1)}%`}}
                    ></div>
                </div>
            </div>

            <div className="ml-2 mr-2 mt-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">나의 평균 평점</div>
                    <div className="flex items-center">
                        <div
                            className="mr-2 text-m font-bold">{reviewCount === 0 ? 0 : (reviewList.reduce((acc: number, rating: number) => acc + rating, 0) / reviewCount).toFixed(1)}</div>
                        {renderStars((reviewList.reduce((acc: number, rating: number) => acc + rating, 0) / reviewCount))}
                    </div>
                    <div className="flex items-center">
                        <div className="text-xs font-bold pl-3 pr-3">리뷰 수 {reviewCount}</div>
                    </div>
                </div>
                {[5, 4, 3, 2, 1].map((rating: number) => {
                    const ScorePerRating: number = reviewList.filter((r: number) => r === rating).length / reviewCount * 100;
                    return (
                        <div key={rating} className="flex items-center mt-4">
                            <StarFillIcon className="text-[#FFCA28] w-4 h-4 mr-1"/>
                            <p className="text-sm w-4 font-medium text-blue-600 dark:text-blue-500 select-none">
                                {rating}
                            </p>
                            <Progress
                                className="ml-2 mr-4"
                                indicatorColor="bg-yellow-300 w-full h-5 rounded-full"
                                value={reviewCount === 0 ? 0 : ScorePerRating}
                            />
                            <p className="text-sm w-8 text-end font-medium text-gray-500 dark:text-gray-400">
                                {reviewCount === 0 ? 0 : ScorePerRating}%
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-20"/>

        </>

    );
}
