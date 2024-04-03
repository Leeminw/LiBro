package com.ssafy.libro.global.fileupload.service;

import com.ssafy.libro.global.fileupload.dto.FileUploadResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {
    FileUploadResponseDto fileUpload(MultipartFile multipartFile) throws IOException;
}
