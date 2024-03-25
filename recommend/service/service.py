from config.db import get_db, get_model_url
from typing import List
from data.book import Book
from repository.repository import get_book_list, get_total_book_count, get_user_book_count_distinct
import random
import pickle
import numpy as np


def get_random_book_list(size : int ) -> List[dict] :
    engine = get_db()
    total_count = get_total_book_count(engine=engine)
    choosed = tuple(random.sample(range(1, total_count + 1), size))
    response_data = get_book_list(engine, choosed)
    return response_data

def get_recommend_book_list(user_id : int, size : int ) -> List[dict] :
    engine = get_db() 
    # 책 갯수 찾기
    n_books = get_user_book_count_distinct(engine)
    print("최대 도서 갯수 ", n_books)
    print("load model")
    model_url = get_model_url()
    with open(model_url, 'rb') as f:
        loaded_model = pickle.load(f)
    print("추천 리스트 ")

    # user_id는 1기준으로 입력받기 때문에, -1 해준다.
    recommendations = loaded_model.predict(user_id-1, np.arange(n_books))
    
    # 상위 size 개의 도서 id 반환한다. id는 0기준이므로 1씩 증가해서
    book_list = tuple(x + 1 for x in recommendations.argsort()[::-1][:size])
    
    response_data = get_book_list(engine,book_list)
    
    return response_data

