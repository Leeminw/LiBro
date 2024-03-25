package com.ssafy.libro.domain.usergroup.repository;

import com.ssafy.libro.domain.club.entity.Club;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.usergroup.entity.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserGroupRepository extends JpaRepository<UserGroup, Long>, UserGroupCustomRepository {
    void deleteByClubAndUser(Club club, User user);

    void deleteByClub(Club club);

    Optional<UserGroup> findByClubAndUser(Club club, User user);
}
