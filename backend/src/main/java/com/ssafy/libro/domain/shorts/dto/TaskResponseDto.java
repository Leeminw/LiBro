package com.ssafy.libro.domain.shorts.dto;

import com.ssafy.libro.domain.shorts.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDto {
    private Long id;
    private Long bookId;
    private String isbn;
    private String title;
    private Boolean status;

    private String summary;
    private String korPrompt;
    private String engPrompt;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public TaskResponseDto(Task entity) {
        this.id = entity.getId();
        this.bookId = entity.getBookId();

        this.isbn = entity.getIsbn();
        this.title = entity.getTitle();
        this.status = entity.getStatus();

        this.summary = entity.getSummary();
        this.korPrompt = entity.getKorPrompt();
        this.engPrompt = entity.getEngPrompt();

        this.createdDate = entity.getCreatedDate();
        this.updatedDate = entity.getUpdatedDate();
    }
}
