from flask import json, Response
from http import HTTPStatus

def make_response_entity(data : dict , status : HTTPStatus ) :
    
    success = status.value//100 <= 2
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
    
    response_data = Response(response=payload, content_type="application/json; charset=utf-8", status=status )
    
    return response_data