package com.ssafy.libro.domain.board.service;

import com.ssafy.libro.domain.board.dto.BoardCreateRequestDto;
import com.ssafy.libro.domain.board.dto.BoardResponseDto;
import com.ssafy.libro.domain.board.entity.Board;
import com.ssafy.libro.domain.board.repository.BoardRepository;
import com.ssafy.libro.domain.club.entity.Club;
import com.ssafy.libro.domain.club.repository.ClubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final ClubRepository clubRepository;
    @Override
    public List<BoardResponseDto> getBoardList(Long groupId) {
        return boardRepository.getBoardListByGroupId(groupId)
                .stream().map(board -> new BoardResponseDto(board.getId(),board.getName())).toList();
    }

    @Override
    public BoardResponseDto getBoard() {
        return null;
    }

    @Override
    public void createBoard(BoardCreateRequestDto dto) {
        Club club = clubRepository.findById(dto.getClubId()).orElse(null);
        if(club == null){
            //throw new Exception();
        }
        Board board= Board.builder().name(dto.getName()).club(club).isDeleted(false)
                .createdDate(LocalDateTime.now()).updatedDate(LocalDateTime.now()).build();
        boardRepository.save(board);
    }

    @Override
    public void deleteBoard(Long boardId) {
        Board board = boardRepository.findById(boardId).orElse(null);
        boardRepository.delete(board);
    }
}
