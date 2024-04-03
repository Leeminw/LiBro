from config.db import get_db, get_model_url
from repository.repository import get_user_book_matrix, get_book_matrix, get_user_matrix
from lightfm import LightFM
import pandas as pd 
from scipy.sparse import coo_matrix, csr_matrix
import numpy as np
import pickle
import os
from lightfm.data import Dataset
from lightfm.cross_validation import random_train_test_split

def train () : 
    
    model = LightFM(loss='warp')
    
    engine = get_db()

    model_url = get_model_url()

    ratings = get_user_book_matrix(engine)


    if ratings.empty : 
        with open(model_url, 'wb') as f:
            pickle.dump(model, f)

        return 
    item_meta = get_book_matrix(engine)

    user_meta = get_user_matrix(engine)

    # print(books.head())
    ratings_source = [(ratings['user_id'][i], ratings['book_id'][i]) for i in range(ratings.shape[0])]

    item_meta = item_meta[['book_id', 'author', 'rating', 'title']]

    item_features_source = [(item_meta['book_id'][i],
                            [item_meta['author'][i],
                            item_meta['rating'][i]]) for i in range(item_meta.shape[0])]

    user_meta = user_meta[['user_id','age', 'gender', 'interest']]

    user_features_source = [(user_meta['user_id'][i],
                            [user_meta['age'][i],
                            user_meta['gender'][i]]) for i in range(user_meta.shape[0])]

    dataset = Dataset()
    dataset.fit(users = ratings['user_id'].unique(),
                items = ratings['book_id'].unique(),
                item_features=item_meta[item_meta.columns[1:]].values.flatten(),
                user_features=user_meta[user_meta.columns[1:]].values.flatten())

    interactions, weights = dataset.build_interactions(ratings_source)
    item_features = dataset.build_item_features(item_features_source)
    user_features = dataset.build_user_features(user_features_source)

    interactions = interactions.tocsr().tocoo()
    train_weights = interactions.multiply(weights).tocoo()

    model.fit(interactions=interactions,
              item_features=item_features,
              user_features=user_features,
              sample_weight=train_weights,
              epochs=10,
              verbose=False)

    with open(model_url, 'wb') as f:
        pickle.dump(model, f)

if __name__ == "__main__" :
    print("train start")
    train()
    print("train end")

