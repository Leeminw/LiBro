package com.ssafy.libro.domain.usergroup.service;

import com.ssafy.libro.domain.club.entity.Club;
import com.ssafy.libro.domain.club.exception.ClubNotFoundException;
import com.ssafy.libro.domain.club.repository.ClubRepository;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.exception.UserNotFoundException;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.domain.usergroup.dto.*;
import com.ssafy.libro.domain.usergroup.entity.ClubRole;
import com.ssafy.libro.domain.usergroup.entity.UserGroup;
import com.ssafy.libro.domain.usergroup.exception.AlreadyJoinedException;
import com.ssafy.libro.domain.usergroup.exception.NotFoundJoinException;
import com.ssafy.libro.domain.usergroup.repository.UserGroupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserGroupServiceImpl implements UserGroupService {
    private final ClubRepository clubRepository;
    private final UserGroupRepository userGroupRepository;
    private final UserRepository userRepository;


    @Override
    public ClubDetailResponseDto getClubDetail(Long clubId) {
        return userGroupRepository.getClubDetail(clubId).orElseThrow(
                () -> new ClubNotFoundException(clubId)
        );
    }

    @Override
    public ClubSummaryResponseDto getClubSummary(Long clubId) {
        return userGroupRepository.getClubSummary(clubId).orElseThrow(
                () -> new ClubNotFoundException(clubId)
        );
    }

    @Override
    public Slice<ClubListDetailResponseDto> getClubList(ClubListDetailRequestDto dto) {
        return userGroupRepository.getClubList(dto);
    }

    @Override
    public List<ClubMemberDetailResponseDto> getClubMembers(Long clubId) {
        return userGroupRepository.getClubMemberList(clubId);
    }

    @Override
    public void joinClub(Long clubId, ClubJoinClubRequestDto dto) {
        Club club = clubRepository.findById(clubId).orElseThrow(
                () -> new ClubNotFoundException(clubId)
        );

        User user = userRepository.findById(dto.getUserId()).orElseThrow(
                () -> new UserNotFoundException(dto.getUserId())
        );

        Optional<UserGroup> byClubAndUser = userGroupRepository.findByClubAndUser(club, user);

        if (byClubAndUser.isPresent()) {
            throw new AlreadyJoinedException(club, user);
        }

        UserGroup userGroup = UserGroup.builder()
                .user(user)
                .club(club)
                .role(ClubRole.CLUB_USER)
                .build();

        userGroupRepository.save(userGroup);
    }

    @Override
    public void leaveClub(Long clubId, Long memberId) {
        Club club = clubRepository.findById(clubId).orElseThrow(
                () -> new ClubNotFoundException(clubId)
        );
        User user = userRepository.findById(memberId).orElseThrow(
                () -> new UserNotFoundException(memberId)
        );

        UserGroup userGroup = userGroupRepository.findByClubAndUser(club, user).orElseThrow(
                () -> new NotFoundJoinException(club, user)
        );

        userGroup.leaveClub();
    }

    @Override
    public Slice<MyClubResponseDto> getMyClubs(MyClubRequestDto dto) {
        return userGroupRepository.getMyClubs(dto);
    }

    @Override
    public ClubMemberShipResponseDto getClubMemberShip(Long clubId, Long userId) {
        ClubMemberShipResponseDto memberShip = userGroupRepository.getClubMemberShip(clubId, userId);

        if (memberShip == null) return new ClubMemberShipResponseDto(clubId, userId, null);
        return memberShip;
    }
}
