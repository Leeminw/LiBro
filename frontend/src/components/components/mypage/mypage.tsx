'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {useMutation, useQueries, useQueryClient} from "@tanstack/react-query";
import {
    editUserProfile,
    getCompleteBookList,
    getCompleteRatio,
    getUserInform,
    getWrittenComment
} from "@/lib/axiois-mypage";
import useUserState from "@/lib/login-state";
import {useRouter} from "next/navigation";
import {toast} from "@/components/ui/use-toast";
import {Progress} from "@/components/ui/progress";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger} from "@/components/ui/dialog";
import {uploadToS3} from "@/lib/axios-fileupload";

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
    const queryClient = useQueryClient();
    // 임시 닉네임 상태

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

    const [userInfo, completeRatio, bookReviews, writtenComment] = results.map(result => result.data);

    const reviewList = bookReviews && bookReviews.map((r: {
        rating: number;
    }) => r.rating).filter((r: null | number) => r !== null);
    const reviewCount = reviewList && reviewList.length;

    const [tempNickName, setTempNickName] = useState("");
    const [tempProfile, setTempProfile] = useState("");

    const editMutation = useMutation({
        mutationFn: (param: UserProfileEdit) => editUserProfile(param),
        onSuccess: (data, variables, context) => {
            toast({
                title: "프로필이 정상적으로 변경 완료 되었습니다.",
            })
            queryClient.invalidateQueries({queryKey: ['myinfo']})
        },
        onError: (error, variables, context) => {
            toast({
                title: "수정 중 에러가 발생 되었습니다.",
            })
        }
    });

    // 닉네임 임시 변경 핸들러
    const handleTempNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempNickName(event.target.value); // 추출한 값을 사용하여 상태 업데이트
    };

    const fileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0] as File;
            uploadFile(file);
        } else {
            console.error('파일이 선택되지 않았습니다.');
        }
    }

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const result = await uploadToS3(formData);
        setTempProfile(result.uploadedFileName);
    };

    const openDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
        setTempProfile(userInfo.profile);
        setTempNickName(userInfo.nickName);
    }

    const closeDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
        setTempProfile("");
        setTempNickName("");
    }

    const submitEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
        const newProfile: UserProfileEdit = {
            profile: tempProfile,
            nickName: tempNickName
        };
        editMutation.mutate(newProfile)
    }

    if (isLoading) return <>Loading...</>;
    if (hasError) return <>Error</>;

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
                            <DialogClose onClick={closeDialog}></DialogClose>
                            <DialogTrigger asChild onClick={openDialog}>
                                <Button
                                    className="mt-4 bg-[#9268EB] text-white font-bold hover:bg-[#9268EB] hover:text-current">Edit
                                    Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="">
                                <DialogHeader>프로필 수정</DialogHeader>
                                <div className='flex justify-center items-center w-full'>
                                    <div className="relative"> {/* 여기에 relative 추가 */}
                                        <Avatar className="h-16 w-16 mt-2">
                                            <AvatarImage src={tempProfile}
                                                         alt="@defaultUser">
                                            </AvatarImage>
                                            <AvatarFallback></AvatarFallback>
                                        </Avatar>
                                        <Button
                                            className="absolute bottom-0 right-0 bg-[#9268EB] rounded-full p-0.5 w-6 h-6 hover:bg-white"
                                            disabled={editMutation.isPaused}
                                        > {/* 배경 동그라미와 위치 조정 */}
                                            <div className="relative w-6 h-6 flex justify-center items-center">
                                                <Image src='mdi_pencil.svg' alt='pencil' width={20} height={20}
                                                       className="bg-[#9268EB] rounded-full absolute cursor-pointer"/>
                                                <Input type="file" onChange={fileUpload} title={""}
                                                       className="absolute opacity-0"/>

                                            </div>
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
                                    <DialogClose>
                                        <Button type="submit" onClick={submitEdit}>수정하기</Button>
                                    </DialogClose>
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
