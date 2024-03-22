package com.ssafy.libro.domain.usergroup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClubListDetailRequestDto {
        private String sortOrder;
        private String keyword;
        private Long clubId;
}
