package com.ssafy.libro.domain.userbook.entity;

import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.userbook.dto.UserBookRatingRequestDto;
import com.ssafy.libro.domain.userbook.dto.UserBookUpdateRequestDto;
import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    @Column(columnDefinition = "TINYINT(1)")
    @ColumnDefault("false")
    private Boolean isComplete;
    private Double rating;
    private String ratingComment;
    @Column(columnDefinition = "TINYINT(1)")
    private Boolean ratingSpoiler;
    @CreationTimestamp
    private LocalDateTime createdDate;
    @UpdateTimestamp
    private LocalDateTime updatedDate;
    @Column(columnDefinition = "TINYINT(1)")
    @ColumnDefault("false")
    private Boolean isDeleted;
    // Join
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @OneToMany(mappedBy = "userBook", fetch = FetchType.LAZY)
    private List<UserBookHistory> userBookHistoryList;

    @OneToMany(mappedBy = "userBook", fetch = FetchType.LAZY)
    private List<UserBookComment> userBookCommentList;

    public void updateUser(User user){
        this.user = user;
    }
    public void updateBook(Book book){
        this.book = book;
    }

    public void update(UserBookUpdateRequestDto requestDto){
        this.type = requestDto.getType();
    }
    public void updateType(String type){
        this.type = type;
    }
    public void updateRating(UserBookRatingRequestDto requestDto){
        this.rating = requestDto.getRating();
        this.ratingComment = requestDto.getRatingComment();
        this.ratingSpoiler = requestDto.getRatingSpoiler();
    }
    public void updateDelete(){
        this.isDeleted = true;
    }
    public void updateComplete() {
        this.isComplete = true;
    }
}
