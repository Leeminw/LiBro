package com.ssafy.libro.domain.userbookhistory.controller;

import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryCreateRequestDto;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryDetailResponseDto;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryUpdateRequestDto;
import com.ssafy.libro.domain.userbookhistory.service.UserBookHistoryService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/bookhistory")
@RequiredArgsConstructor
public class UserBookHistoryController {

    private final UserBookHistoryService userBookHistoryService;

    @PostMapping("")
    public ResponseEntity<?> createUserBookHistory(@RequestBody UserBookHistoryCreateRequestDto requestDto){
        UserBookHistoryDetailResponseDto responseDto = userBookHistoryService.createUserBookHistory(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success(responseDto));
    }

    @PutMapping("")
    public ResponseEntity<?> updateUserBookHistory(@RequestBody UserBookHistoryUpdateRequestDto requestDto){
        UserBookHistoryDetailResponseDto responseDto = userBookHistoryService.updateUserBookHistory(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @GetMapping("/{historyId}")
    public ResponseEntity<?> getUserBookHistory(@PathVariable Long historyId){
        UserBookHistoryDetailResponseDto responseDto = userBookHistoryService.getUserBookHistory(historyId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @DeleteMapping("/{historyId}")
    public ResponseEntity<?> deleteUserBookHistory(@PathVariable Long historyId){
        userBookHistoryService.deleteUserBookHistory(historyId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("history deleted"));
    }

    @GetMapping("/userbook/{userBookId}")
    public ResponseEntity<?> getUserBookHistoryListByUser(@PathVariable Long userBookId){
        List<UserBookHistoryDetailResponseDto> responseDtoList = userBookHistoryService.getUserBookHistoryList(userBookId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDtoList));
    }

}
