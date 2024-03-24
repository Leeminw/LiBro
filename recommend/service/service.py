from config.db import get_db
from typing import List
from data.book import Book
from repository.repository import get_book_list, get_total_book_count
import random


def get_random_book_list(size : int ) -> List[dict] :
    engine = get_db()
    total_count = get_total_book_count(engine=engine)
    choosed = tuple(random.sample(range(1, total_count + 1), size))
    response_data = get_book_list(engine, choosed)
    return response_data