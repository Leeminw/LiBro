from flask import Flask
from http import HTTPStatus
from service.service import get_random_book_list, get_recommend_book_list
from data.response import make_response_entity
import jwt
from flask import request
from config.db import get_jwt_secret_key
from datetime import datetime, timezone
import pytz


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False



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
        print('exp:' , exp)
        seoul_timezone = pytz.timezone('Asia/Seoul')
        current_time = datetime.now(seoul_timezone).timestamp()

        if exp < current_time :
            return False, 'expired'
        
        return True, user_id

    except Exception as e :
        return False, 'no data'



@app.route('/')
def random_book() :
    # token = get_bearer_token()
    # if(token is None) :
    #     return make_response_entity("fail" , HTTPStatus.UNAUTHORIZED)
    
    # info = validateToken(token)
    # if(not info[0]) :
    #     return make_response_entity("fail", HTTPStatus.UNAUTHORIZED)
    result = get_recommend_book_list(user_id=10,size=10)


    return make_response_entity(result,HTTPStatus.OK)


@app.route('/flask/api/v1/recommend/<userId>')
def get_book_list() :
    user_id = -1    
    token = get_bearer_token()

    if token :
        info = validateToken(token)
        if(info[0]) :
            user_id =  info[1]
        else :
            make_response_entity(info[1], HTTPStatus.UNAUTHORIZED)

    if(user_id != -1 ) :
        # 토큰에서 정보를 못얻는경우 랜덤 책 리스트 반환
        result = get_random_book_list(10)
    else :
        # 추천 도서 리스트 
        result = get_recommend_book_list(user_id=int(info[1]),size=10)
            

    return make_response_entity(result,HTTPStatus.OK)

if __name__ == '__main__':
    app.run(debug=True)