from config.db import get_db, get_model_url
from repository.repository import get_user_book_matrix, get_book_matrix
from lightfm import LightFM
import pandas as pd 
from scipy.sparse import coo_matrix, csr_matrix
import numpy as np
import pickle
import os

# 가중치 어떻게 적용하지..
USER_BOOK_WEIGHT = 0.5
BOOK_REGIST_WEIHGT = 0.2
VIEW_COUNT_WEIGHT = 0.2


# 볼떄마다 다르게 하려면 어떻게..
# 협업 상위 n개중 랜덤한 m 개
# 다른 추천 방식 ex 그냥 랜덤 
# 하위 n개중 랜덤한 m개 

# 주기적으로 학습해서 모델
def train() : 
    model = LightFM(loss='warp')
    model_url = get_model_url()
    
    engine = get_db()

    df = get_user_book_matrix(engine)
    book_df = get_book_matrix(engine)
    one_hot = pd.get_dummies(book_df)

    # 빈데이터인경우 그냥 저장.
    if df.empty : 
        with open(model_url, 'wb') as f:
            pickle.dump(model, f)

        return    

    users = df['user_id'].unique()
    books = df['book_id'].unique()
    # row_indices = pd.Index(users, name='user_id')
    # col_indices = pd.Index(books, name='book_id')
    data_values = df['rating'].values

    user_book_matrix = coo_matrix((data_values, (df['user_id'] , df['book_id'])))
    # book_matrix = csr_matrix(one_hot.values)    
    # print(book_matrix)
    # print(sparse_matrix)
    model.fit(user_book_matrix, epochs=30 )
    

    # 모델 저장
    with open(model_url, 'wb') as f:
        pickle.dump(model, f)

if __name__ == "__main__":
    print("train start")
    recommendations = train()
    print("train end")
    