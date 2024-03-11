package com.ssafy.libro.domain.user.repository;

import com.ssafy.libro.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    User findByEmail(String email);
    User findUserById(Long id);
    Optional<User> findUserByAuthTypeAndAuthId(String type, String authId);
}
