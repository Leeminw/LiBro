package com.ssafy.libro.domain.shorts.controller;

import com.ssafy.libro.domain.shorts.dto.TaskRequestDto;
import com.ssafy.libro.domain.shorts.dto.TaskResponseDto;
import com.ssafy.libro.domain.shorts.exception.TaskValidationException;
import com.ssafy.libro.domain.shorts.service.TaskServiceImpl;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskServiceImpl taskService;

    @PostMapping("/api/v1/task")
    public ResponseEntity<?> createTask(@RequestBody TaskRequestDto requestDto) {
        TaskResponseDto responseDto = taskService.createTask(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @PutMapping("/api/v1/task")
    public ResponseEntity<?> updateTask(@RequestBody TaskRequestDto requestDto) {
        TaskResponseDto responseDto = taskService.updateTask(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @DeleteMapping("/api/v1/task/{id}")
    public ResponseEntity<?> createTask(@PathVariable Long id) {
        TaskResponseDto responseDto = taskService.deleteTask(id);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @GetMapping("/api/v1/task")
    public ResponseEntity<?> getTaskById(@RequestParam(required = false) Long id,
                                         @RequestParam(required = false) String isbn) {
        if (id == null && isbn == null) throw new TaskValidationException();
        TaskResponseDto responseDto = id != null ?
                taskService.getTaskById(id) :
                taskService.getTaskByIsbn(isbn);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @GetMapping("/api/v1/task/list")
    public ResponseEntity<?> getTaskById(@RequestParam(required = false) Boolean status,
                                         @RequestParam(required = false) String title,
                                         @RequestParam(required = false) String summary,
                                         @RequestParam(required = false) String korPrompt,
                                         @RequestParam(required = false) String engPrompt) {
        List<TaskResponseDto> responseDto;
        if (status != null) responseDto = taskService.getAllTasksByStatus(status);
        else if (title != null) responseDto = taskService.getAllTasksByTitleContaining(title);
        else if (summary != null) responseDto = taskService.getAllTasksBySummaryContaining(summary);
        else if (korPrompt != null) responseDto = taskService.getAllTasksByKorPromptContaining(korPrompt);
        else if (engPrompt != null) responseDto = taskService.getAllTasksByEngPromptContaining(engPrompt);
        else responseDto = taskService.getAllTasks();
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

}
