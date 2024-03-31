package com.ssafy.libro.domain.usergroup.repository;

import com.ssafy.libro.domain.club.entity.Club;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.usergroup.entity.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserGroupRepository extends JpaRepository<UserGroup, Long>, UserGroupCustomRepository {
    Optional<UserGroup> findByClubAndUser(Club club, User user);

    List<UserGroup> findAllByClub(Club club);
}
