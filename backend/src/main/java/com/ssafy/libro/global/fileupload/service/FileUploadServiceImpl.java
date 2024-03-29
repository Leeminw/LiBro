package com.ssafy.libro.global.fileupload.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.libro.global.fileupload.dto.FileUploadResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.bucket-name}")
    private String bucket;

    @Override
    public FileUploadResponseDto fileUpload(MultipartFile multipartFile) throws IOException {
        String originalFileName = getOriginalFileName(multipartFile);
        String uploadedFileName = uploadToS3(multipartFile);
        return new FileUploadResponseDto(originalFileName, uploadedFileName);
    }

    private String uploadToS3(MultipartFile multipartFile) throws IOException {
        String fileName = UUID.randomUUID() + "-" + multipartFile.getOriginalFilename();
        String contentType = multipartFile.getContentType();
        InputStream inputStream = multipartFile.getInputStream();
        ObjectMetadata objectMetadata =  new ObjectMetadata();
        objectMetadata.setContentType(contentType);
        amazonS3.putObject(
                new PutObjectRequest(bucket, fileName, inputStream, objectMetadata)
                        .withCannedAcl(CannedAccessControlList.PublicRead)	// PublicRead 권한으로 업로드 됨
        );
        return amazonS3.getUrl(bucket, fileName).toString();
    }

    private String getOriginalFileName(MultipartFile multipartFile) {
        return multipartFile.getOriginalFilename();
    }
}
