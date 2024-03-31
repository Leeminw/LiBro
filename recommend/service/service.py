from config.db import get_db, get_model_url
from typing import List
from data.book import Book
from repository.repository import get_book_list, get_total_book_count, get_user_book_count_distinct
import random
import pickle
import numpy as np
from lightfm import LightFM


def get_exist_shorts() -> List[dict] :
    engine = get_db()
    choosed = (1,2,3,4,5,6,7,8,9,10)
    response_data = get_book_list(engine,choosed)
    return response_data

def get_random_book_list(size : int ) -> List[dict] :
    engine = get_db()
    total_count = get_total_book_count(engine=engine)
    choosed = tuple(random.sample(range(1, total_count + 1), size))
    response_data = get_book_list(engine, choosed)
    return response_data

def get_recommend_book_list(user_id : int, size : int ) -> List[dict] :
    engine = get_db() 
    # 책 갯수 찾기
    # n_books = get_user_book_count_distinct(engine)
    # print("최대 도서 갯수 ", n_books)
    total_count = get_total_book_count(engine=engine)

    model_url = get_model_url()
    with open(model_url, 'rb') as f:
        model : LightFM = pickle.load(f)
    
    # print("추천 리스트 ")
    
    all_item_ids=  np.arange(model.item_embeddings.shape[0])
    # user_id는 1기준으로 입력받기 때문에, -1 해준다.
    recommendations = model.predict(user_ids=user_id, item_ids=all_item_ids)
    # 상위 size 개의 도서 id 반환한다. id는 0기준이므로 1씩 증가해서

    # 역순으로 정렬 
    recommendations = [ x + 1 for x in recommendations.argsort()[::-1] ]
    
    length = len(recommendations)

    choosed = set() 
    
    top_end = length//2
    low_start = length//10*9
    top_recommend_list = recommendations[:top_end]
    low_recommend_list = recommendations[low_start:]
    # 상위에서 50% 중에서 7 개
    # 데이터가 없으면 더 적게 선정 (사용자 데이터가 없는 경우)
    
    top_length = len(top_recommend_list)
    top_count = min( top_length//10 * 7 , 7 ) 

    indexes = random.sample(range(0, top_length), top_count)
    for index in indexes :
        choosed.add(top_recommend_list[index])

    # 하위에서 10% 중에서 1 개
    low_length = len(low_recommend_list)
    low_count = min(1, low_length//10)

    indexes = random.sample(range(0, low_length), low_count)
    for index in indexes : 
        choosed.add(low_recommend_list[index])

    # 남은 만큼은 랜덤하게 합쳐서 리턴하자.
    random_count = size - top_count - low_count

    numbers = random.sample(range(0, total_count+1), random_count)

    for number in numbers : 
        choosed.add(number)


    response_data = get_book_list(engine,tuple(choosed))

    return response_data
    

