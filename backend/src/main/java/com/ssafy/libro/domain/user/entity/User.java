package com.ssafy.libro.domain.user.entity;

import com.ssafy.libro.domain.article.entity.Article;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER,targetEntity = UserBook.class)
    private List<UserBook> userBookList;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Article> articles;


    public User update(String name, String profile) {
        this.name = name;
        this.profile = profile;
        return this;
    }

    public String getRoleKey() {
        return this.role.getKey();
    }
}
