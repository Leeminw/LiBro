package com.ssafy.libro.domain.club.repository;

import com.ssafy.libro.domain.club.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club,Long> {
}
