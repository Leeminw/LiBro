from config.db import get_db
from sqlalchemy import Engine, text
from data.book import Book
from typing import List,Dict,Tuple
import random
from datetime import datetime

def get_total_book_count(engine : Engine) -> int :
    with engine.connect() as con : 
        statement = text(
                """
                SELECT count(*) 
                FROM book
                """
                )

        result = con.execute(statement)
        size = result.fetchone()[0]
    
    return size



def get_book_list(engine : Engine, recommended : list) -> List[dict] :
    
    with engine.connect() as con :
        statement = text(
            '''
            SELECT *
            FROM book
            WHERE id in {}
            '''.format(recommended)
        )

        result = con.execute(statement)
        response = []
        keys = result.keys()
        for r in result :   
            response_data = dict() 
            for key in keys:
                response_data[key] = r._get_by_key_impl_mapping(key)
                if isinstance(response_data[key], datetime):
                    response_data[key] = response_data[key].strftime("%Y-%m-%d %H:%M:%S")
                    
            response.append(response_data)
        
    return response