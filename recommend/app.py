from flask import Flask
from http import HTTPStatus
from service.service import get_random_book_list, get_recommend_book_list, get_exist_shorts
from data.response import make_response_entity
import jwt
from flask import request
from config.db import get_jwt_secret_key
from datetime import datetime, timezone
import pytz
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from train import train
import os
import cv2
from pyzbar.pyzbar import decode
import numpy as np
def read_isbn_barcode(image_file):
    # 이미지를 읽어옵니다.
    image = cv2.imdecode(np.fromstring(image_file.read(), np.uint8), cv2.IMREAD_UNCHANGED)    
    barcodes = decode(image)
    
    if barcodes:
        decoded_string = barcodes[0].data.decode('utf-8')
        if decoded_string.startswith("978") or decoded_string.startswith("979"):
            return decoded_string
    
    return None

def my_job():
    print('train start, pid : ', os.getpid())
    train()
    print('train end')

scheduler = BackgroundScheduler()
scheduler.add_job(func=my_job, trigger="interval", seconds=60*60)  # 한시간마다 실행
if not scheduler.state:
    scheduler.start()

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app, resources={r"/*": {"origins": "*"}})


def get_bearer_token() -> str:
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]
    return None

def validateToken(token) -> tuple: 
    try :
        secret = get_jwt_secret_key()

        decoded = jwt.decode(token, secret, algorithms=["HS512"] )
        user_id = decoded["id"] 
        exp =  decoded["exp"]
        seoul_timezone = pytz.timezone('Asia/Seoul')
        current_time = datetime.now(seoul_timezone).timestamp()

        if exp < current_time :
            return False, 'expired'
        
        return True, user_id

    except Exception as e :
        return False, 'no data'



@app.route('/')
def random_book() :

    result = get_exist_shorts()

    return make_response_entity(result,HTTPStatus.OK)


@app.route('/flask/api/v1/recommend')
def get_book_list() :
    user_id = -1    
    token = get_bearer_token()
    print('token' , token)
    if token :
        info : tuple = validateToken(token)
        print('info' , info)
        if(info[0]) :
            user_id =  info[1]
        else :
            make_response_entity(info[1], HTTPStatus.UNAUTHORIZED)

    if(user_id == -1 ) :
        # 토큰에서 정보를 못얻는경우 랜덤 책 리스트 반환
        result = get_random_book_list(10)
    else :
        # 추천 도서 리스트 
        result = get_recommend_book_list(user_id=int(user_id),size=10)
            

    return make_response_entity(result,HTTPStatus.OK)



@app.route('/flask/api/v1/isbn', methods=['POST'])
def get_isbn() :
    if 'image' not in request.files :
        return make_response_entity("no data", HTTPStatus.BAD_REQUEST)
    
    image_file = request.files['image']

    if image_file.filename == '' :
        return make_response_entity("no data", HTTPStatus.BAD_REQUEST)

    isbn = read_isbn_barcode(image_file)
    if isbn : 
        return make_response_entity({'isbn' : isbn}, HTTPStatus.OK)
    else :
        return make_response_entity("not isbn barcode", HTTPStatus.BAD_REQUEST)

if __name__ == '__main__':

    app.run(debug=True)