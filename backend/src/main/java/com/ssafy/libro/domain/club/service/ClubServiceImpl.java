package com.ssafy.libro.domain.club.service;

import com.ssafy.libro.domain.club.dto.ClubCreateRequestDto;
import com.ssafy.libro.domain.club.dto.ClubUpdateRequestDto;
import com.ssafy.libro.domain.club.entity.Club;
import com.ssafy.libro.domain.club.exception.ClubNotFoundException;
import com.ssafy.libro.domain.club.repository.ClubRepository;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.exception.UserNotFoundException;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.domain.usergroup.entity.ClubRole;
import com.ssafy.libro.domain.usergroup.entity.UserGroup;
import com.ssafy.libro.domain.usergroup.repository.UserGroupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ClubServiceImpl implements ClubService {
    private final ClubRepository clubRepository;
    private final UserGroupRepository userGroupRepository;
    private final UserRepository userRepository;

    @Override
    public Long createClub(ClubCreateRequestDto dto) {
        Club club = clubRepository.save(dto.toClubEntity());
        User user = userRepository.findById(dto.getUserId()).orElseThrow(
                () -> new UserNotFoundException(dto.getUserId())
        );

        UserGroup userGroup = UserGroup.builder()
                .user(user)
                .club(club)
                .role(ClubRole.CLUB_ADMIN)
                .build();

        userGroupRepository.save(userGroup);

        return club.getId();
    }

    @Override
    public void updateClub(Long clubId, ClubUpdateRequestDto dto) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new ClubNotFoundException(clubId));
        club.update(dto);
    }

    @Override
    public void deleteClub(Long clubId) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new ClubNotFoundException(clubId));
        userGroupRepository.deleteByClub(club);
        clubRepository.delete(club);
    }

}
