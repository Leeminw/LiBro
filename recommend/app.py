from flask import Flask, make_response
import os
from dotenv import load_dotenv
from flask import jsonify
from http import HTTPStatus
import random
from config.db import get_db
from sqlalchemy import create_engine


app = Flask(__name__)

# DB 연결
engine = get_db()


def response_entity(data = "", status = 200) :
    success = status//100 <= 2
    return jsonify(
        {
            "status" : "success" if success else "error",
            "message" : "The request has been processed successfully." if  success 
            else "An unexpected error occurred while processing the request." ,
            "data" : data 
        }
    )

@app.route('/')
def home() :
    with engine.connect() as conn : 
        result = conn.execute(
            
        )

        for r in result :
            print(r)

    return response_entity("hello", HTTPStatus.INTERNAL_SERVER_ERROR )


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