package com.ssafy.libro.domain.userbook.entity;

import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import jakarta.persistence.*;
import lombok.*;
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
    private Boolean isComplete;
    private Float rating;
    private String ratingComment;
    @Column(columnDefinition = "TINYINT(1)")
    private Boolean ratingSpoiler;
    @CreationTimestamp
    private LocalDateTime createdDate;
    @UpdateTimestamp
    private LocalDateTime updatedDate;

    // Join
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;



    private void updateUser(User user){
        this.user = user;
    }
    private void updateBook(Book book){
        this.book = book;
    }

}
