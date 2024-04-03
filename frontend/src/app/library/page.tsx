"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { IoIosArrowForward } from "react-icons/io";
import { userBooks } from "@/lib/axios-userBook";
import { useRouter, useSearchParams } from "next/navigation";
import instance from "@/lib/interceptor";
import SubHeader from "@/components/SubHeader";
import { useToast } from "@/components/ui/use-toast";
import { MdDelete } from "react-icons/md";
import useUserState from "@/lib/login-state";

interface User {
  profileUrl: string;
  id: string;
  nickName: string;
  truename: string;
  birth: string;
  readRate: number;
  bookRate: number;
}

interface BookData {
  userBookId: number;
  isbn: string;
  image: string;
  title: string;
  publisher: string;
  createdDate: string;
  author: string;
  complete: boolean;
}
// userBookId >> 넘기면 누르면 db조회
interface ModalProps {
  userBook: UserBook;
  onClose: () => void;
}
interface UserBook {
  book: BookData;
  userBookId: number;
  userId: number;
  bookId: number;
  type: string;
  isCompleted: boolean | null;
  rating: number | null;
  ratingComment: string | null;
  ratingSpoiler: boolean | null;
  createdDate: string;
  updateDate: string;
  commentList: Comment[] | null;
  history: History | null;
}

interface Comment {
  id: number;
  content: string;
  createdDate: string;
  updatedDate: string;
}
interface History {
  userBookHistoryId: number;
  startDate: string;
  endDate: string;
}
interface Review {
  review?: string;
  rating?: number;
  isSpoiler?: boolean;
  timestamp?: Date;
  historyList: History[] | null;
}

const Library = () => {
  const isbn = useSearchParams().get("isbn");
  const { toast } = useToast();
  const { getUserInfo } = useUserState();
  const [user, setUser] = useState<User>({
    profileUrl: "https://github.com/shadcn.png",
    id: getUserInfo().id.toString(),
    nickName: getUserInfo().nickname,
    truename: "",
    birth: "11",
    readRate: 0,
    bookRate: 1,
  });
  // 스크롤 최상단 이동
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };
  const [pageLoad, setPageLoad] = useState<boolean>(false);

  // 책 페이지
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  const router = useRouter();

  const [books, setBooks] = useState([]);

  // 검색어를 업데이트하는 함수입니다.
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const [arrange, setArrange] = useState("");

  // 정렬과 검색을 모두 적용한 책 목록
  const [processedBooks, setProcessedBooks] = useState([...books]);

  // 검색과 정렬이 모두 반영되어야 하므로, useEffect를 사용해 두 상태의 변화를 감지합니다.
  useEffect(() => {
    // 먼저, 검색 적용
    let updatedBooks = books.filter(
      (book: BookData) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 그 다음, 정렬 적용
    switch (arrange) {
      case "책 제목 순":
        updatedBooks.sort((a: BookData, b: BookData) =>
          a.title.localeCompare(b.title, "ko")
        );
        break;
      case "저자명 순":
        updatedBooks.sort((a: BookData, b: BookData) =>
          a.author.localeCompare(b.author, "ko")
        );
        break;
      case "출판사 순":
        updatedBooks.sort((a: BookData, b: BookData) =>
          a.publisher.localeCompare(b.publisher, "ko")
        );
        break;
      case "최근 발행 순":
        updatedBooks.sort(
          (a: BookData, b: BookData) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        );
        break;
      // 기본 정렬 로직 또는 기본값 설정이 필요할 경우 추가
    }

    // 최종적으로 처리된 책 목록을 상태에 저장
    setProcessedBooks(updatedBooks);
  }, [searchTerm, arrange, books]);

  const selectAllBooks = () => {
    userBooks
      .books()
      .then((response) => {
        console.log(response.data);
        const processedData = response.data.map(
          (item: any) =>
            (item = {
              userBookId: item.userBookId,
              image: item.bookDetailResponseDto.thumbnail,
              title: item.bookDetailResponseDto.title,
              publisher: item.bookDetailResponseDto.publisher,
              createdDate: item.bookDetailResponseDto.createdDate,
              author: item.bookDetailResponseDto.author,
              complete: item.isComplete,
              isbn: item.bookDetailResponseDto.isbn,
            })
        );
        console.log("changed data : ", processedData);
        setBooks(processedData);
      })
      .catch((error) => {
        console.log(error);
        router.push("/login");
      });
  };
  // 등록 책 전체 조회
  useEffect(() => {
    if (!pageLoad) {
      setPageLoad(true);
      selectAllBooks();
    }
  }, []);

  // 현재 페이지에 보여줄 책들을 계산합니다.
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = processedBooks.slice(indexOfFirstBook, indexOfLastBook);

  // 페이지 번호를 클릭했을 때 현재 페이지를 업데이트합니다.
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // 전체 페이지 수를 계산합니다.
  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(processedBooks.length / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  // 모달 상태와 선택된 책 정보를 관리하기 위한 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);
  const [bookHistory, setBookHistory] = useState<History | null>(null);

  // 모달을 여는 함수
  const openModal = async (book: BookData) => {
    console.log("userbookId", book.userBookId);
    const { data } = await instance.get(
      "/api/v1/userbook/detail/" + book.userBookId
    );
    const historyList: History[] = data.data.historyList;

    const selectedUserBook: UserBook = {
      book: book,
      ...data.data,
      history: historyList ? historyList[historyList.length - 1] : null,
    };
    console.log(selectedUserBook);
    setSelectedBook(selectedUserBook);
    setBookHistory(selectedUserBook.history);
    setIsModalOpen(true);
  };

  // 모달을 닫는 함수
  const closeModal = async () => {
    // 완독 갱신
    await userBooks
      .books()
      .then((response) => {
        console.log(response.data);
        const processedData = response.data.map(
          (item: any) =>
            (item = {
              userBookId: item.userBookId,
              image: item.bookDetailResponseDto.thumbnail,
              title: item.bookDetailResponseDto.title,
              publisher: item.bookDetailResponseDto.publisher,
              createdDate: item.bookDetailResponseDto.createdDate,
              author: item.bookDetailResponseDto.author,
              complete: item.isComplete,
              isbn: item.bookDetailResponseDto.isbn,
            })
        );
        console.log("changed data : ", processedData);
        setBooks(processedData);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const BookModal = ({ userBook, onClose }: ModalProps) => {
    if (!userBook) return null;

    // 책의 독서 시작
    const startReading = async (userBookId: number) => {
      const now: Date = new Date();
      const localDateTimeString: string = now.toISOString();
      const response = await instance.post("/api/v1/bookhistory", {
        userBookId: userBookId,
        startDate: localDateTimeString,
      });
      toast({
        description: "독서 기록을 시작합니다.",
      });
      console.log("read start");
      setBookHistory(response.data.data);
    };

    // 독서 포기
    const giveUpReading = async (bookHistory: History) => {
      // console.log(bookHistory.userBookHistoryId)
      try {
        const response = await instance.delete(
          "/api/v1/bookhistory/" + bookHistory.userBookHistoryId
        );
        const currentResponse = await instance.get(
          "/api/v1/bookhistory/recent/" + userBook.userBookId
        );
        toast({
          description: "독서를 포기하셨습니다.",
        });
        setBookHistory(currentResponse.data.data);
      } catch (error) {
        console.log("error", error);
        setBookHistory(null);
      }
    };

    // 독서 완료
    const completeReading = async (bookHistory: History) => {
      console.log(bookHistory);
      // 완료 표시
      const response = await instance.get(
        "/api/v1/bookhistory/complete/" + bookHistory.userBookHistoryId
      );
      toast({
        description: "도서를 완독하셨어요! 평점을 등록하실 수 있습니다.",
      });
      // 가장 최근 도서기록 가져오기
      const currentResponse = await instance.get(
        "/api/v1/bookhistory/recent/" + userBook.userBookId
      );
      console.log(currentResponse.data);
      setBookHistory(currentResponse.data.data);
      userBook.isCompleted = true;
    };

    const Header = () => {
      return (
        <div className="relative h-32 rounded-t-lg">
          {/* 블러 처리된 배경 이미지 */}
          <div
            className="absolute inset-0 bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: `url(${userBook.book.image})` }}
          >
            <div className="w-full h-full inset-0 bg-black/40 backdrop-blur-md rounded-t-lg">
              {/* 선명한 책 이미지와 정보 */}
              <div className="relative flex items-end h-32 rounded-t-lg">
                <Button
                  className="absolute right-0 top-0 text-white hover:bg-white/30 w-10 p-2.5"
                  variant="ghost"
                  onClick={onClose}
                >
                  <Image
                    src="x-white.svg"
                    alt="search"
                    width={40}
                    height={40}
                  />
                </Button>
                <div className="absolute drop-shadow-lg">
                  <Image
                    src={userBook.book.image}
                    alt="Book Cover"
                    width={70}
                    height={105}
                    className="rounded w-full h-full max-h-32 translate-y-4 ml-4"
                  />
                </div>
                <div className="pl-32 h-20 flex flex-col pr-2">
                  <h2 className="text-white text-md font-bold line-clamp-2">
                    {userBook.book.title}
                  </h2>
                  <div className="flex items-center mt-2">
                    <p className="text-xs text-gray-300 line-clamp-1">
                      저자 {userBook.book.author.split("^").join(", ")} | 출판사{" "}
                      {userBook.book.publisher.split("^").join(", ")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pl-32">
                <div>
                  <Link
                    href={`/detail?isbn=${userBook.book.isbn}`}
                    className="text-[#9268EB] text-xs font-semibold w-fit whitespace-nowrap"
                  >
                    도서 정보 보기 {">"}
                  </Link>
                </div>
                <div className="w-full"></div>
                <button
                  className="w-10 h-10 p-1.5 mx-1 mt-1 text-center bg-red-400 hover:bg-red-300 rounded-md duration-300 transition-colors aspect-square"
                  onClick={async () => {
                    await userBooks
                      .bookDelete(userBook.userBookId)
                      .then((response) => {
                        console.log("response", response);
                        toast({
                          description: "나의 서재에서 도서를 뺐습니다.",
                        });
                        setIsModalOpen(false);
                        selectAllBooks();
                      })
                      .catch((error) => {
                        toast({
                          description:
                            "나의 서재에서 도서를 빼는데 실패했습니다.",
                        });
                      });
                  }}
                >
                  <div className=" text-white flex justify-center items-center ">
                    <MdDelete size={"1.5rem"} />
                  </div>
                </button>
              </div>
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
            <Button className="flex justify-start items-center font-bold text-xs text-gray-500 bg-white border border-gray-300 shadow-lg w-full hover:bg-gray-100 ">
              {bookHistory ? (
                bookHistory.endDate ? (
                  <p>
                    {" "}
                    {extractDate(bookHistory.startDate) +
                      " ~ " +
                      extractDate(bookHistory.endDate)}{" "}
                  </p>
                ) : (
                  <p> {extractDate(bookHistory.startDate)} 부터 독서중 </p>
                )
              ) : (
                <p>독서 기록이 없습니다.</p>
              )}
            </Button>
          </div>
        </div>
      );
    };
    function extractDate(dateString: string): string {
      const matchResult = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!matchResult) {
        throw new Error("잘못된 형식의 날짜 문자열입니다.");
      }

      const [, yearStr, monthStr, dayStr] = matchResult;
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      return `${year}년 ${month}월 ${day}일`;
    }
    const Review = () => {
      const [review, setReview] = useState(
        userBook.ratingComment ? userBook.ratingComment : ""
      );
      const [rating, setRating] = useState(
        userBook.rating ? userBook.rating : 0
      ); // 별점 상태 초기화
      const [isSpoiler, setIsSpoiler] = useState(
        userBook.ratingSpoiler ? userBook.ratingSpoiler : false
      ); // 스포일러 체크박스 상태
      const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
          stars.push(
            <button
              key={i}
              onClick={() => setRating(i)} // 클릭 시 별점 상태 업데이트
              className={`w-7 h-7 mx-0.5 ${
                rating >= i ? "fill-current text-[#FFCA28]" : "text-yellow-500"
              }`}
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

      const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        setIsSpoiler(event.target.checked); // 체크박스 상태 업데이트
      };

      const saveReview = async (userBook: UserBook) => {
        if (!userBook.isCompleted) {
          toast({
            description: "완독하셔야 평점 등록이 가능합니다.",
          });
          return;
        }
        toast({
          description: "평점이 등록되었습니다.",
        });
        console.log("save button");
        const ratingData = {
          userBookId: userBook.userBookId,
          rating: rating,
          ratingComment: review,
          ratingSpoiler: isSpoiler,
        };
        console.log(ratingData);
        const response = await instance.post(
          "/api/v1/userbook/rating",
          ratingData
        );
        // user book 갱신

        const { data } = await instance.get(
          "/api/v1/userbook/detail/" + userBook.userBookId
        );
        const historyList: History[] = data.data.historyList;

        const selectedUserBook: UserBook = {
          book: selectedBook?.book,
          ...data.data,
          history: historyList ? historyList[historyList.length - 1] : null,
        };
        setSelectedBook(selectedUserBook);
      };

      // 'YYYY/MM/DD 오후 HH:mm' 형식의 문자열로 시간을 변환하는 함수
      const formatTimestamp = (timestamp: Date | undefined) => {
        if (!timestamp) return "Invalid date";

        let year = timestamp.getFullYear().toString();
        let month = (timestamp.getMonth() + 1).toString().padStart(2, "0");
        let day = timestamp.getDate().toString().padStart(2, "0");
        let hour = timestamp.getHours();
        let minute = timestamp.getMinutes().toString().padStart(2, "0");

        let ampm = hour >= 12 ? "오후" : "오전";
        hour = hour % 12;
        hour = hour ? hour : 12; // 시간이 0이면 12로 변경
        let strHour = hour.toString().padStart(1, "0");

        return `${year}/${month}/${day} ${ampm} ${strHour}:${minute}`;
      };

      return (
        <div className="mx-6 mt-6">
          <h1 className="mb-3 text-xl font-bold">나의 평점</h1>
          {
            // 리뷰가 없을때
            !userBook.rating && !userBook.ratingComment ? (
              <>
                <div className="flex items-end justify-between mb-2">
                  <div className="mr-2 text-m font-bold flex items-end">
                    {renderStars()}
                  </div>
                  <div className="flex items-center">
                    <Input
                      type="checkbox"
                      id="spoilerCheckbox"
                      checked={isSpoiler}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="spoilerCheckbox"
                      className="ml-2 text-sm font-bold"
                    >
                      스포일러 포함
                    </label>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="리뷰를 입력하세요."
                    className="w-full p-2 mr-2 border rounded"
                  />
                  <Button
                    onClick={() => saveReview(userBook)}
                    className="bg-[#9268EB] hover:bg-[#bfa1ff] rounded-md p-0.5 w-12 h-12 aspect-square"
                  >
                    <Image
                      src="mdi_pencil.svg"
                      alt="pencil"
                      width={30}
                      height={30}
                    />
                  </Button>
                </div>
              </>
            ) : (
              //  리뷰 입력 완료
              <>
                <div className="rounded border border-gray-300 shadow-lg p-4">
                  <div className="flex justify-between">
                    <div className="text-lg font-bold mr-2 flex w-full">
                      {user.nickName}
                    </div>
                    <div className="w-full flex justify-end text-nowrap">
                      {renderStars()}
                    </div>
                  </div>
                  <div className="text-sm mb-1 pt-2">
                    {userBook.ratingComment}
                  </div>
                  {/* 여기에 별점과 스포일러 여부도 표시 */}
                  {userBook.ratingSpoiler && (
                    <div className="text-red-500 w-full flex justify-end">스포일러 포함</div>
                  )}
                </div>
              </>
            )
          }
        </div>
      );
    };

    const Sentence = () => {
      const [api, setApi] = useState<CarouselApi>();
      const [current, setCurrent] = useState(0);
      const [count, setCount] = useState(0);
      const [inputs, setInputs] = useState(
        userBook.commentList ? userBook.commentList : []
      ); // 입력한 텍스트를 저장할 배열 상태를 추가
      const [currentInput, setCurrentInput] = useState("");

      useEffect(() => {
        if (!api) {
          return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
          setCurrent(api.selectedScrollSnap() + 1);
        });
      }, [api]);
      // 감명받은 글귀 저장하기
      const handleSave = async () => {
        const response = await instance.post("/api/v1/comment", {
          userBookId: selectedBook?.userBookId,
          content: currentInput,
        });
        const updateList = await instance.get(
          "/api/v1/comment/userbook/" + selectedBook?.userBookId
        );
        const commentList = updateList.data.data;

        setInputs(commentList);
        setCurrentInput(""); // 입력 상태 초기화
        setCount(commentList.length + 1);
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentInput(e.target.value); // 입력 필드의 변경사항을 currentInput 상태에 반영
      };

      return (
        <div className="mx-6 mt-6 mb-2">
          <div className="flex justify-between">
            <h1 className="mb-3 text-xl font-bold">감명깊은 글귀</h1>
            <Button
              onClick={handleSave}
              className="bg-[#9268EB] hover:bg-[#bfa1ff] text-sm text-white font-bold p-3 rounded-md h-8"
            >
              저장
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <Carousel setApi={setApi} className="w-5/6">
              <CarouselContent>
                {inputs.map((input, index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="flex items-center justify-center p-3 h-24 text-xs">
                        <textarea
                          className="flex w-full p-2 justify-center items-center text-center h-full resize-none"
                          rows={4}
                          value={input.content}
                          disabled={true}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
                <CarouselItem>
                  <Card>
                    <CardContent className="flex items-center justify-center p-3 h-24 text-xs">
                      <textarea
                        placeholder="여기에 글귀를 입력하세요"
                        className="flex w-full p-2 justify-center items-center text-center h-full resize-none"
                        rows={4}
                        value={currentInput}
                        onChange={handleInputChange}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="border-gray-600 ml-2" />
              <CarouselNext className="border-gray-600 mr-2" />
            </Carousel>
          </div>
          <div className="py-2 text-center text-xs text-muted-foreground">
            {current} / {count}
          </div>
        </div>
      );
    };

    const ButtonComponent = () => {
      if (!bookHistory || bookHistory.endDate) {
        // 독서 기록이 없을 때
        return (
          <div className="flex flex-col items-center pb-4 px-4">
            <button
              className="w-full p-1.5 mx-6 mb-2 text-center bg-[#9268EB] hover:bg-[#bfa1ff] rounded-md duration-300 transition-colors"
              onClick={() => startReading(userBook.userBookId)}
            >
              <div className="text-white ">독서 기록 시작하기</div>
            </button>
          </div>
        );
      }
      //     // 독서 완료 or 포기 버튼
      // else if (!bookHistory.endDate) {
      //     return (
      //         <div className="flex justify-center">
      //             <button className="w-full p-1.5 mx-6 text-center bg-[#9268EB] rounded-md" onClick={startReading}>
      //                 <div className=" text-white  ">독서 기록 다시 시작하기</div>
      //             </button>
      //         </div>
      //     );
      // }
      else if (!bookHistory.endDate) {
        //     // 독서 중일 때
        return (
          <div className="flex justify-center mx-6 pb-4">
            <button
              className="w-full bg-[#F87171] text-white p-1.5 rounded-md mr-4"
              onClick={() => giveUpReading(bookHistory)}
            >
              독서 포기
            </button>
            <button
              className="w-full bg-[#9268EB] text-white p-1.5  rounded-md"
              onClick={() => completeReading(bookHistory)}
            >
              완독
            </button>
          </div>
        );
      }
    };

    return (
      <div
        className={`fixed w-full h-full inset-0 bg-black z-40 bg-opacity-50 flex justify-center items-center px-4 overflow-y-hidden animate-modal-overlay-on`}
      >
        <div
          className={`bg-white rounded-lg w-full max-w-md h-3/4 overflow-y-auto duration-500 transition-all scrollbar-hide`}
        >
          <Header />
          <Record />
          <Review />
          <Sentence />
          <ButtonComponent />
        </div>
      </div>
    );
  };
  // 여기까지
  return (
    <div
      ref={scrollRef}
      className="bg-bg-svg bg-no-repeat bg-cover scrollbar-hide overflow-y-scroll relative h-screen max-h-[90vh]"
    >
      <SubHeader title="나의 서재" backArrow={false} />
      <div className="absolute flex w-full justify-between items-center h-12 bg-black/60 backdrop-blur-md pl-3 py-3 text-white text-sm mt-12 top-2">
        <div className="pl-3">전체 {books.length}권</div>
        <div className="flex w-2/5 pr-2">
          <Select onValueChange={(value) => setArrange(value)}>
            <SelectTrigger
              id="arrangeSelect"
              className="w-full h-1/5 text-gray-900 border-none text-xs"
            >
              <SelectValue className="" placeholder="최근 담은 순" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="최근 담은 순">최근 담은 순</SelectItem>
              <SelectItem value="책 제목 순">책 제목 순</SelectItem>
              <SelectItem value="저자명 순">저자명 순</SelectItem>
              <SelectItem value="출판사 순">출판사 순</SelectItem>
              <SelectItem value="최근 발행 순">최근 발행 순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="px-3 pt-32 pb-28">
        <div className="flex items-center justify-end rounded-lg mx-3 bg-white h-10 relative">
          <Input
            value={searchTerm}
            className="flex-1 border-none h-10 py-2 pr-24"
            placeholder="제목, 작가, 출판사 등으로 검색"
            onChange={handleSearch}
          />
          <div className="flex items-center absolute justify-end h-full">
            <Button
              className="text-gray-500 rounded-full h-full"
              variant="ghost"
              onClick={() => setSearchTerm("")}
            >
              <Image src="xd.svg" alt="search" width={14} height={14} />
            </Button>
            <div className="border-l h-2/3 border-gray-400"></div>
            <Button className="text-gray-500 h-full" variant="ghost">
              <Image src="search1.svg" alt="search" width={16} height={16} />
            </Button>
          </div>
        </div>
        <div className="p-1 flex flex-col items-center">
          <div className="grid sm:grid-cols-4 grid-cols-3">
            {pageNumbers.length != 0 &&
              currentBooks.map((book: BookData, index) => (
                <div key={`book-${index}`}>
                  <div
                    className="drop-shadow-xl shadow-border pb-2 border-b-8 border-white flex justify-center items-end h-fit"
                    onClick={() => openModal(book)}
                  >
                    <div
                      className={`w-full h-40 mt-4 mx-1 bg-gray-200 flex items-end ${
                        book.complete &&
                        "border-4 border-lime-500 border-opacity-70"
                      }`}
                    >
                      <Image
                        src={book.image}
                        alt={`Book ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full"
                      />
                      <div className="absolute top-4 left-0 w-full h-40 bg-black bg-opacity-60 flex justify-start transition-opacity opacity-0 hover:opacity-100 duration-500 cursor-pointer">
                        <p className="text-white text-sm mx-2 my-6 line-clamp-6 text-ellipsis break-words">
                          {book.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {Array.from({ length: 12 - currentBooks.length }, (_, index) => (
              <div
                key={`empty-${index}`}
                className="drop-shadow-xl pb-2 shadow-border border-b-8 border-white flex justify-center items-end h-fit min-w-28"
              >
                <div className="w-full h-40 mt-4 mx-1"></div>
              </div>
            ))}
          </div>

          {isModalOpen && selectedBook && (
            <BookModal userBook={selectedBook} onClose={closeModal} />
          )}

          {pageNumbers.length != 0 && (
            <nav className="mt-4 py-1 px-2 w-fit bg-white rounded-full flex items-center">
              <ul className="pagination flex items-center justify-center">
                {pageNumbers.map((number) => (
                  <li
                    key={number}
                    className={`page-item mx-0.5 ${
                      currentPage === number
                        ? "text-white bg-[#9268EB] rounded-full w-10 h-10 flex justify-center items-center font-bold"
                        : "text-gray-900 w-10 h-10 rounded-full hover:bg-gray-200 flex justify-center items-center cursor-pointer transition-all duration-300"
                    }`}
                    onClick={() => {
                      scrollTop();
                      paginate(number);
                    }}
                  >
                    {number}
                  </li>
                ))}
                {pageNumbers.length > 0 && (
                  <li
                    className="page-item mx-1 text-gray-900 w-10 h-10 rounded-full hover:bg-gray-200 font-bold cursor-pointer flex justify-center items-center transition-all duration-300"
                    onClick={(e) => {
                      scrollTop();
                      paginate(pageNumbers[pageNumbers.length - 1]);
                    }}
                  >
                    <IoIosArrowForward />
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;

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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarEmptyIcon(props: any) {
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
  );
}
