from flask import Flask
from http import HTTPStatus
from service.service import get_random_book_list, get_recommend_book_list
from data.response import make_response_entity
app = Flask(__name__)
from pyspark.sql import SparkSession

app.config['JSON_AS_ASCII'] = False



@app.route('/')
def random_book() :
    result = get_random_book_list(10)

    return make_response_entity(result,HTTPStatus.OK)


@app.route('/recommend/<userId>')
def get_book_list(userId) :
    
    result = get_recommend_book_list(user_id=int(userId),size=10)
    
    return make_response_entity(result,HTTPStatus.OK)
@app.route('/flask/api/v1/recommend')
def recommend():
        
    # 추천알고리즘 
    result = {
        # 책 아이디
        # 쇼츠 url 
        # list 
    }

    return "hello"

if __name__ == '__main__':
    app.run(debug=True)