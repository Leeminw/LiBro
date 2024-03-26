package com.ssafy.libro.domain.board.service;

import com.ssafy.libro.domain.board.dto.BoardCreateRequestDto;
import com.ssafy.libro.domain.board.dto.BoardResponseDto;
import com.ssafy.libro.domain.board.dto.BoardUpdateRequestDto;
import com.ssafy.libro.domain.board.entity.Board;
import com.ssafy.libro.domain.board.exception.BoardNotFoundException;
import com.ssafy.libro.domain.board.repository.BoardRepository;
import com.ssafy.libro.domain.club.entity.Club;
import com.ssafy.libro.domain.club.exception.ClubNotFoundException;
import com.ssafy.libro.domain.club.repository.ClubRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final ClubRepository clubRepository;
    @Override
    public List<BoardResponseDto> getBoardList(Long groupId) {
        return boardRepository.getBoardListByGroupId(groupId)
                .stream().map(board -> new BoardResponseDto(board.getId(),board.getName())).toList();
    }

    @Override
    public Long createBoard(BoardCreateRequestDto dto) {
        Club club = clubRepository.findById(dto.getClubId()).orElseThrow(
                () -> new ClubNotFoundException(dto.getClubId())
        );

        Board board = boardRepository.save(dto.toEntity(club));

        return board.getId();
    }

    @Override
    public void updateBoard(BoardUpdateRequestDto dto) {
        Club club = clubRepository.findById(dto.getClubId()).orElseThrow(
                () -> new ClubNotFoundException(dto.getClubId())
        );

        Board board = boardRepository.findById(dto.getBoardId()).orElseThrow(
                () -> new BoardNotFoundException(dto.getBoardId())
        );

        board.update(dto);
    }

    @Override
    public void deleteBoard(Long boardId) {
        Board board = boardRepository.findById(boardId).orElse(null);
        boardRepository.delete(board);
    }
}
