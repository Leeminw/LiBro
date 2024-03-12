package com.ssafy.libro.domain.userbookhistory.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/bookhistory")
public class UserBookHistoryController {

    @GetMapping("/health")
    public ResponseEntity<?> getHealth () {
        return ResponseEntity.ok("test");
    }
}
