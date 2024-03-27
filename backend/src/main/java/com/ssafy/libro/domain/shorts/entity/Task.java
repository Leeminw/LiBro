package com.ssafy.libro.domain.shorts.entity;

import com.ssafy.libro.domain.shorts.dto.TaskRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long bookId;
    private String isbn;
    private String title;
    private Boolean status;

    @Column(columnDefinition = "LONGTEXT")
    private String summary;
    @Column(columnDefinition = "LONGTEXT")
    private String korPrompt;
    @Column(columnDefinition = "LONGTEXT")
    private String engPrompt;

    @CreationTimestamp
    private LocalDateTime createdDate;
    @UpdateTimestamp
    private LocalDateTime updatedDate;

    public Task update(TaskRequestDto requestDto) {
        if (requestDto.getBookId() != null) this.bookId = requestDto.getBookId();
        if (requestDto.getIsbn() != null) this.isbn = requestDto.getIsbn();
        if (requestDto.getTitle() != null) this.title = requestDto.getTitle();
        if (requestDto.getStatus() != null) this.status = requestDto.getStatus();
        if (requestDto.getSummary() != null) this.summary = requestDto.getSummary();
        if (requestDto.getKorPrompt() != null) this.korPrompt = requestDto.getKorPrompt();
        if (requestDto.getEngPrompt() != null) this.engPrompt = requestDto.getEngPrompt();
        return this;
    }

    public Task changeStatus() {
        this.status = !this.status;
        return this;
    }

    public Task updateKorPrompt(String korPrompt) {
        this.korPrompt = korPrompt;
        return this;
    }

    public Task updateEngPrompt(String engPrompt) {
        this.engPrompt = engPrompt;
        return this;
    }

}
