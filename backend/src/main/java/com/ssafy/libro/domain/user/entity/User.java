package com.ssafy.libro.domain.user.entity;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String authId;

    @Column(nullable = false)
    private String authType;

    @Column
    private String profile;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private LocalDateTime birth;

    @Column(name = "is_deleted", nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean isDeleted;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    public User(UserJoinRequestDto dto) {
        this.name = dto.getName();
        this.email = dto.getEmail();
        this.nickname = dto.getNickname();
        this.gender = dto.getGender();
        this.birth = dto.getBirth();
        this.isDeleted = false;
        this.profile = dto.getProfile();
        this.role = Role.USER;
    }

    @Builder
    public User(String name, String email, String profile, String authType, String authId,Role role) {
        this.name = name;
        this.email = email;
        this.profile =profile;
        this.role = role;
    }

    public User update(String name, String picture) {
        this.name = name;
        this.profile = picture;
        return this;
    }

    public String getRoleKey() {
        return this.role.getKey();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", authId='" + authId + '\'' +
                ", authType='" + authType + '\'' +
                ", profile='" + profile + '\'' +
                ", nickname='" + nickname + '\'' +
                ", gender='" + gender + '\'' +
                ", birth=" + birth +
                ", isDeleted=" + isDeleted +
                ", role=" + role +
                '}';
    }
}
