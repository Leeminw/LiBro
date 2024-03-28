class Book : 
    id: int
    title : str
    author : str
    translator : str
    isbn : str
    price : int
    pub_date : str
    publisher : str
    rating : float
    rating : int
    shorts_url: str
    summary : str
    thumbnail : str
    created_date : str
    update_date : str
    
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
    


    def to_dict(self):
        """
        Book 클래스의 객체를 딕셔너리로 변환하는 함수
        """
        book_dict = {}
        for key, value in self.__dict__.items():
            if not key.startswith("__") and not callable(getattr(self, key)):
                book_dict[key] = value
        return book_dict
    # def __init__(self, id: int, title: str, author: str, translator: str, isbn: str,
    #              price: int, pub_date: str, publisher: str, rating: float,
    #              rating_count: int, shorts_url: str, summary: str, thumbnail: str,
    #              created_date: str, update_date: str):
    #     self.id = id
    #     self.title = title
    #     self.author = author
    #     self.translator = translator
    #     self.isbn = isbn
    #     self.price = price
    #     self.pub_date = pub_date
    #     self.publisher = publisher
    #     self.rating = rating
    #     self.rating_count = rating_count
    #     self.shorts_url = shorts_url
    #     self.summary = summary
    #     self.thumbnail = thumbnail
    #     self.created_date = created_date
    #     self.update_date = update_date
