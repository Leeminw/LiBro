package com.ssafy.libro.domain.book.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseList {
    private List<ApiResponseItem> items;
}
