package com.ssafy.libro.domain.shorts.dto;

import com.ssafy.libro.domain.shorts.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequestDto {
    private String isbn;
    private String title;
    private Boolean status;

    private String summary;
    private String korPrompt;
    private String engPrompt;

    public Task toEntity() {
        return Task.builder()
                .isbn(this.isbn)
                .title(this.title)
                .status(this.status)
                .summary(this.summary)
                .korPrompt(this.korPrompt)
                .engPrompt(this.engPrompt)
                .build();
    }
}
