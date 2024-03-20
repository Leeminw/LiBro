package com.ssafy.libro.global.util.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class Response {

    public String getSuccessString(String message, Object data) throws JsonProcessingException {
        Map<String,Object> result = new HashMap<>();
        result.put("result","success");
        result.put("message",message);
        result.put("data",data);
        return new ObjectMapper().writeValueAsString(result);
    }
    public String getFailString(String message,Object data) throws JsonProcessingException {
        Map<String,Object> result = new HashMap<>();
        result.put("result","failed");
        result.put("message",message);
        result.put("data",data);
        return new ObjectMapper().writeValueAsString(result);
    }

    public String getCustomResponseString(String resultString,String message, Object data) throws JsonProcessingException {
        Map<String,Object> result = new HashMap<>();
        result.put("result",resultString);
        result.put("message",message);
        result.put("data",data);
        return new ObjectMapper().writeValueAsString(result);
    }

    public ResponseEntity<Map<String,Object>> handleSuccess(String message, Object data){
        Map<String,Object> result = new HashMap<>();
        result.put("result","success");
        result.put("message",message);
        result.put("data",data);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    public ResponseEntity<Map<String,Object>> handleFail(String message,Object data){
        Map<String,Object> result = new HashMap<>();
        result.put("result","failed");
        result.put("message",message);
        result.put("data",data);
        return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<Map<String,Object>> handleCustomResponse(String resultString,String message, Object data,HttpStatus status){
        Map<String,Object> result = new HashMap<>();
        result.put("result",resultString);
        result.put("message",message);
        result.put("data",data);
        return new ResponseEntity<>(result, status);
    }


}
