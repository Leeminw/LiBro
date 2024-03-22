package com.ssafy.libro.domain.club.entity;

import com.ssafy.libro.domain.article.dto.ArticleUpdateRequestDto;
import com.ssafy.libro.domain.board.entity.Board;
import com.ssafy.libro.domain.club.dto.ClubUpdateRequestDto;
import com.ssafy.libro.domain.usergroup.entity.UserGroup;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(columnDefinition = "TINYINT(1)")
    @ColumnDefault("false")
    private Boolean isDeleted;

    @CreationTimestamp
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Board> boards;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserGroup> userGroups;

    public void update(ClubUpdateRequestDto dto){
        this.name = dto.getName();
        this.description = dto.getDescription();
        this.updatedDate = LocalDateTime.now();
    }
}
