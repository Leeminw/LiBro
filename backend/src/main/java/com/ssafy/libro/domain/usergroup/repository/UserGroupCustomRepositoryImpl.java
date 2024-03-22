package com.ssafy.libro.domain.usergroup.repository;

import com.nimbusds.oauth2.sdk.util.StringUtils;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.libro.domain.usergroup.dto.*;
import com.ssafy.libro.domain.usergroup.entity.ClubRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ssafy.libro.domain.club.entity.QClub.club;
import static com.ssafy.libro.domain.usergroup.entity.QUserGroup.userGroup;


@Repository
@RequiredArgsConstructor
public class UserGroupCustomRepositoryImpl implements UserGroupCustomRepository {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public ClubDetailResponseDto getClubDetail(Long clubId) {
        return jpaQueryFactory
                .select(Projections.constructor(
                        ClubDetailResponseDto.class,
                        userGroup.club.id,
                        userGroup.club.name,
                        userGroup.club.description,
                        userGroup.club.createdDate,
                        userGroup.user.name.as("userName"),
                        userGroup.user.profile
                ))
                .from(userGroup)
                .where(equalClubId(clubId), equalAdmin())
                .fetchOne();
    }


    @Override
    public Slice<ClubListDetailResponseDto> getClubList(ClubListDetailRequestDto dto) {
        Pageable pageable = PageRequest.ofSize(10);

        List<ClubListDetailResponseDto> fetch = jpaQueryFactory.select(Projections.constructor(
                        ClubListDetailResponseDto.class,
                        userGroup.club.id.as("clubId"),
                        userGroup.user.name.as("userName"),
                        userGroup.club.name,
                        userGroup.club.createdDate
                ))
                .from(userGroup)
                .where(
                        decideId(dto.getClubId(), dto.getSortOrder()),
                        equalKeyword(dto.getKeyword()),
                        equalAdmin()
                )
                .orderBy(orderBy(dto.getSortOrder()))
                .limit(pageable.getPageSize() + 1)
                .fetch();


        return new SliceImpl<>(fetch, pageable, hasNextPage(fetch, pageable.getPageSize()));
    }

    @Override
    public List<ClubMemberDetailResponseDto> getClubMemberList(Long clubId) {
        return jpaQueryFactory.select(Projections.constructor(
                        ClubMemberDetailResponseDto.class,
                        userGroup.user.name.as("name"),
                        userGroup.user.profile,
                        userGroup.createdDate,
                        userGroup.role
                ))
                .from(userGroup)
                .where(equalClubId(clubId))
                .fetch();

    }

    @Override
    public Slice<MyClubResponseDto> getMyClubs(MyClubRequestDto dto) {
        Pageable pageable = PageRequest.ofSize(10);

        List<MyClubResponseDto> fetch = jpaQueryFactory.select(Projections.constructor(
                        MyClubResponseDto.class,
                        userGroup.club.id.as("clubId"),
                        userGroup.user.name.as("userName"),
                        userGroup.club.name,
                        userGroup.club.createdDate
                ))
                .from(userGroup)
                .where(
                        decideId(dto.getClubId(), dto.getSortOrder()),
                        equalKeyword(dto.getKeyword()),
                        equalAdmin(),
                        equalMe(dto.getUserId())
                )
                .orderBy(orderBy(dto.getSortOrder()))
                .limit(pageable.getPageSize() + 1)
                .fetch();


        return new SliceImpl<>(fetch, pageable, hasNextPage(fetch, pageable.getPageSize()));
    }

    @Override
    public ClubMemberShipResponseDto getClubMemberShip(Long clubId, Long userId) {
        return jpaQueryFactory.select(Projections.constructor(
                        ClubMemberShipResponseDto.class,
                        userGroup.club.id.as("clubId"),
                        userGroup.user.id.as("userId"),
                        userGroup.role.as("role")
                ))
                .from(userGroup)
                .where(
                        equalMe(userId), equalClubId(clubId)
                )
                .fetchOne();
    }

    private static BooleanExpression decideId(Long clubId, String sortOrder) {
        if ("oldest".equals(sortOrder)) {
            if (clubId == null) return null;
            return club.id.gt(clubId);
        } else {
            if (clubId == null) return null;
            return club.id.lt(clubId);
        }
    }

    private static BooleanExpression equalKeyword(String keyword) {
        if (StringUtils.isBlank(keyword)) return null;
        return club.name.like("%" + keyword + "%");
    }

    private static BooleanExpression equalMe(Long id) {
        return userGroup.user.id.eq(id);
    }

    private static BooleanExpression equalAdmin() {
        return userGroup.role.eq(ClubRole.CLUB_ADMIN);
    }


    private static BooleanExpression equalClubId(Long clubId) {
        return userGroup.club.id.eq(clubId);
    }

    private OrderSpecifier<?> orderBy(String sortOrder) {
        if ("latest".equals(sortOrder) || sortOrder == null) return club.createdDate.desc();
        return club.createdDate.asc();
    }


    private boolean hasNextPage(List<?> contents, int pageSize) {
        if (contents.size() > pageSize) {
            contents.remove(pageSize);
            return true;
        }
        return false;
    }
}
