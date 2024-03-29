package com.ssafy.libro.global.fileupload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileUploadResponseDto {
    private String originalFileName;
    private String uploadedFileName;
}
