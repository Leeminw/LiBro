package com.ssafy.libro.global.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseData<T> {
    private static final Integer SUCCESS_CODE = HttpStatus.OK.value();
    private static final Integer FAILURE_CODE = HttpStatus.BAD_REQUEST.value();

    private Integer status;
    private String message;
    private T data;

    public static <T> ResponseData<T> success(T data) {
        return new ResponseData<>(SUCCESS_CODE, "Success", data);
    }

    public static <T> ResponseData<T> success(String message, T data) {
        return new ResponseData<>(SUCCESS_CODE, message, data);
    }

    public static <T> ResponseData<T> failure(String message) {
        return new ResponseData<>(FAILURE_CODE, message, null);
    }

    public static <T> ResponseData<T> failure(Integer status, String message) {
        return new ResponseData<>(status, message, null);
    }

}
