package com.ssafy.libro.global.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseData<T> {
    private int status;
    private String message;
    private T data;

    public static <T> ResponseData<T> success(T data) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", data);
    }

    public static <T> ResponseData<T> failure(String message) {
        return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), message, null);
    }

    public static <T> ResponseData<T> failure(int status, String message) {
        return new ResponseData<>(status, message, null);
    }

}
