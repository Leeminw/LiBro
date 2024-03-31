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
