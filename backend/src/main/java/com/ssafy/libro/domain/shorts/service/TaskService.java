package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.shorts.dto.TaskRequestDto;
import com.ssafy.libro.domain.shorts.dto.TaskResponseDto;

import java.util.List;

public interface TaskService {
    TaskResponseDto createTask(TaskRequestDto requestDto);
    TaskResponseDto updateTask(TaskRequestDto requestDto);
    TaskResponseDto deleteTask(Long id);

    TaskResponseDto getTaskById(Long id);
    TaskResponseDto getTaskByIsbn(String isbn);

    List<TaskResponseDto> getAllTasks();
    List<TaskResponseDto> getAllTasksByStatus(Boolean status);
    List<TaskResponseDto> getAllTasksByTitleContaining(String title);
    List<TaskResponseDto> getAllTasksBySummaryContaining(String summary);
    List<TaskResponseDto> getAllTasksByKorPromptContaining(String korPrompt);
    List<TaskResponseDto> getAllTasksByEngPromptContaining(String engPrompt);

}
