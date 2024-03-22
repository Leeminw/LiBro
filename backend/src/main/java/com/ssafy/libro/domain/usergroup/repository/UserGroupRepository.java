package com.ssafy.libro.domain.usergroup.repository;

import com.ssafy.libro.domain.club.entity.Club;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.usergroup.entity.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserGroupRepository extends JpaRepository<UserGroup, Long>, UserGroupCustomRepository {
    void deleteByUserAndClub(Club club, User user);

    void deleteByClub(Club club);
}
