package com.ssafy.libro.domain.shorts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.core.io.Resource;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShortsResponseDto {
    private String title;
    private String content;
    private String korPrompt;
    private String engPrompt;
    private String filename;
    private Resource resource;
}
