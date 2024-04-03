package com.ssafy.libro.domain.userbook.service;

import com.ssafy.libro.domain.userbook.dto.*;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

public interface UserBookService {
    // 등록도서 검색

    // 등록도서 목록
    List<UserBookListResponseDto> getUserBookList();

    // 등록도서 상세 >> history, comment 같이 조회
    UserBookDetailResponseDto getUserBook(Long id);

    Long getUserBookByUserAndBook(Long id);

    // 등록도서 추가
    UserBookDetailResponseDto mappingUserBook(UserBookMappingRequestDto requestDto);
    // 등록도서 수정
    UserBookDetailResponseDto updateUserBook(UserBookUpdateRequestDto requestDto);

    // 등록도서 삭제
    void deleteUserBook(Long id);

    // 회원별 월별 도서 기록
    List<UserBookListByDateResponseDto> getBookListByDate(Integer year, Integer month);
    Map<LocalDate, LinkedHashSet<Object>> getBookListByDateV2(Integer year, Integer month);
    UserBookDetailResponseDto updateRating(UserBookRatingRequestDto requestDto);
    UserBookDetailResponseDto updateType(UserBookTypeUpdateRequestDto requestDto);
    //
    UserBookRatioResponseDto getUserReadRatio();
    UserBookRatioResponseDto getBookReadRatio(Long bookId);
    //
    List<UserBookListResponseDto> getUserBookOnReading();
    //
    List<UserBookListResponseDto> getUserBookReadComplete();
    // 특정 사용자가 작성한 글귀 리스트 or 갯수 반환
    List<UserCommentListResponseDto> getUserCommetList();
    //특정 사용자가 리뷰한 책들에 대한 평점 리스트

    UserBookRatioResponseDto getBookReadRatio(String isbn);
    List<UserGenderAgeCountResponseDto> getUserGenderAgeCountList(Long bookId);
    List<UserBookRatingSummary> getUserBookSummaryList(Long bookId);

    List<UserBookRatingResponseDto> getUserBookRatingList(Long bookId);


}
