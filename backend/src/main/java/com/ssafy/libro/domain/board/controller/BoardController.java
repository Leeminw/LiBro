package com.ssafy.libro.domain.board.controller;


import com.ssafy.libro.domain.board.dto.BoardCreateRequestDto;
import com.ssafy.libro.domain.board.dto.BoardResponseDto;
import com.ssafy.libro.domain.board.dto.BoardUpdateRequestDto;
import com.ssafy.libro.domain.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/api/board")
@RestController
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;
    @GetMapping("/list/{groupId}")
    public ResponseEntity<Map<String,Object>> getBoardList(@PathVariable Long groupId){
        System.out.println("list");
        List<BoardResponseDto> list= boardService.getBoardList(groupId);
        Map<String,Object> map = new HashMap<>();
        map.put("data",list);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    @PostMapping("")
    public ResponseEntity<Map<String,Object>> createBoard(@RequestBody BoardCreateRequestDto dto){
        System.out.println("dto:"+dto.getName()+"clubId:"+dto.getClubId());
        boardService.createBoard(dto);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @PutMapping("")
    public ResponseEntity<Map<String,Object>> updateBoard(@RequestBody BoardUpdateRequestDto dto){
        boardService.updateBoard(dto);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }


    @DeleteMapping("{boardId}")
    public ResponseEntity<Map<String,Object>> deleteBoard(@PathVariable("boardId") Long boardId){
        boardService.deleteBoard(boardId);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

}
