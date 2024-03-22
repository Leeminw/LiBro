package com.ssafy.libro.domain.usergroup.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ClubRole {

    CLUB_ADMIN("CLUB_ADMIN", "관리자"),
    CLUB_USER("CLUB_USER", "일반 사용자");

    private final String key;
    private final String title;
}
