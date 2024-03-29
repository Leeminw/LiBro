package com.ssafy.libro.global.fileupload.controller;

import com.ssafy.libro.global.common.ResponseData;
import com.ssafy.libro.global.fileupload.dto.FileUploadResponseDto;
import com.ssafy.libro.global.fileupload.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/upload")
public class FileUploadController {
    private final FileUploadService fileUploadService;

    @PostMapping("")
    public ResponseEntity<?> upload(MultipartFile file) throws IOException {
        FileUploadResponseDto fileUploadResponseDto = fileUploadService.fileUpload(file);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("업로드 성공", fileUploadResponseDto));
    }
}
