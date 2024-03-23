# -- coding: utf-8 --
from flask import Flask, make_response, Response, json
import os
from dotenv import load_dotenv
from flask import jsonify
from http import HTTPStatus
import random
from config.db import get_db
from sqlalchemy import create_engine
from sqlalchemy.sql import text
import datetime
app = Flask(__name__)

# DB 연결
engine = get_db()
app.config['JSON_AS_ASCII'] = False

## 공통 리스폰스 엔티티

def response_entity(data = "", status = 200) :
    success = status//100 <= 2
    payload = json.dumps(
        {
            "status" : "success" if success else "error",
            "message" : "The request has been processed successfully." if  success 
            else "An unexpected error occurred while processing the request." ,
            "data" : data 
        },
        ensure_ascii=False,
        indent=4
    )

    response = Response(payload, content_type="application/json; charset=utf-8")
    return response

@app.route('/')
def random_book() :
    with engine.connect() as conn : 
        
        statement = text(
            """
            SELECT count(*) 
            FROM book
            """
            )

        result = conn.execute(statement)
        size = result.fetchone()[0]
        choosed = tuple(random.sample(range(1, size + 1), 10))


        statement = text(
            '''
            SELECT *
            FROM book
            WHERE id in {}
            '''.format(choosed)
        )

        result = conn.execute(statement)
        response = []
        keys = result.keys()
        for r in result : 
            tmp = dict()
            for key in keys:
                tmp[key] = r._get_by_key_impl_mapping(key)
                if isinstance(tmp[key], datetime.datetime):
                    tmp[key] = tmp[key].strftime("%Y-%m-%d %H:%M:%S")
                    print(type(tmp[key]))
            
            response.append(tmp)
    
    return response_entity(response, HTTPStatus.OK)


@app.route('/flask/api/v1/recommend')
def recommend():
    # db 연결 
        
    # 추천알고리즘 
    result = {
        # 책 아이디
        # 쇼츠 url 
        # list 
    }

    return make_response("hello")

if __name__ == '__main__':
    app.run(debug=True)