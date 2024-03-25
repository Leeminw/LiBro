from config.db import get_db, get_model_url
from repository.repository import get_user_book_matrix
from lightfm import LightFM
import pandas as pd 
from scipy.sparse import coo_matrix
import numpy as np
import pickle
import os

# 가중치 어떻게 적용하지..
USER_BOOK_WEIGHT = 0.5
BOOK_REGIST_WEIHGT = 0.2

# 흠.. 


# 주기적으로 학습해서 모델
def train() : 
    model = LightFM(loss='warp')
    model_url = get_model_url()
    
    df = get_user_book_matrix(get_db())
    # 빈데이터인경우 그냥 저장.
    if df.empty : 
        with open(model_url, 'wb') as f:
            pickle.dump(model, f)

        return    
    print(df)
    users = df['user_id'].unique()
    books = df['book_id'].unique()
    row_indices = pd.Index(users, name='user_id')
    col_indices = pd.Index(books, name='book_id')
    data_values = df['rating'].values

    sparse_matrix = coo_matrix((data_values, (df['user_id'] , df['book_id'])))
    print(sparse_matrix)
    model.fit(sparse_matrix, epochs=30)
    

    # 모델 저장
    with open(model_url, 'wb') as f:
        pickle.dump(model, f)

if __name__ == "__main__":
    print("train start")
    recommendations = train()
    print("train end")
    