from str import str

class UserBook:
    id : int
    book_id : int
    user_id : int
    type : str

    is_complete : bool
    is_on_read : bool
    is_deleted : bool

    rating : float
    rating_comment : str
    rating_spoiler : bool

    created_date : str
    updated_date : str


    def __init__(self, id: int, created_date: str, is_complete: bool,
                 rating: float, rating_comment: str, rating_spoiler: bool,
                 type: str, updated_date: str, book_id: int, user_id: int,
                 is_deleted: bool, is_on_read: bool):
        self.id = id
        self.created_date = created_date
        self.is_complete = is_complete
        self.rating = rating
        self.rating_comment = rating_comment
        self.rating_spoiler = rating_spoiler
        self.type = type
        self.updated_date = updated_date
        self.book_id = book_id
        self.user_id = user_id
        self.is_deleted = is_deleted
        self.is_on_read = is_on_read


# user_book_data = {
#     'id': 1,
#     'created_date': str(2022, 1, 1),
#     'is_complete': True,
#     'rating': 4.5,
#     'rating_comment': 'Great book!',
#     'rating_spoiler': False,
#     'type': 'paperback',
#     'updated_date': str(2022, 2, 1),
#     'book_id': 123,
#     'user_id': 456,
#     'is_deleted': False,
#     'is_on_read': True
# }

# # UserBook 객체 생성
# user_book = UserBook(**user_book_data)

# # UserBook 객체 속성 접근
# print(user_book.rating)  # 출력: 4.5
# print(user_book.is_complete)  # 출력: True