package com.ssafy.libro.domain.user.entity;

import com.ssafy.libro.domain.article.entity.Article;
import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.usergroup.entity.UserGroup;
import com.ssafy.libro.global.util.entity.StringListConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column
    private String authId;
    @Column
    private String authType;

    @Column
    private String profile;

    @Column
    private String nickname;

    @Column
    private char gender;

    @Column
    private int age;

    @Column
    private boolean isDeleted;

    @CreationTimestamp
    @Column
    private LocalDateTime createdDate;

    @Column
    private LocalDateTime updatedDate;

    @Convert(converter = StringListConverter.class)
    @Column
    private List<String> interest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER,targetEntity = UserBook.class)
    private List<UserBook> userBookList;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Article> articles;


    @Builder.Default
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserGroup> userGroupList = new ArrayList<>();

    public String getRoleKey() {
        return this.role.getKey();
    }

    public void updateUserJoin(UserJoinRequestDto user) {
        this.nickname = user.getNickname();
        this.gender = user.getGender();
        this.age = user.getAge();
        this.interest = user.getInterest();
        this.role = Role.USER;
    }
}
