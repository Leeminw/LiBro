package com.ssafy.libro.domain.club.repository;

import com.ssafy.libro.domain.club.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClubRepository extends JpaRepository<Club,Long> {
    Optional<Club> findById(Long clubId);
}
