package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.shorts.dto.TaskRequestDto;
import com.ssafy.libro.domain.shorts.dto.TaskResponseDto;
import com.ssafy.libro.domain.shorts.entity.Task;
import com.ssafy.libro.domain.shorts.exception.TaskNotFoundException;
import com.ssafy.libro.domain.shorts.repository.TaskJpaRepository;
import com.ssafy.libro.domain.shorts.repository.TaskRedisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskJpaRepository taskJpaRepository;
    private final TaskRedisRepository taskRedisRepository;

    @Override
    public TaskResponseDto createTask(TaskRequestDto requestDto) {
        Task task = taskJpaRepository.save(requestDto.toEntity());
        return new TaskResponseDto(task);
    }

    @Override
    public TaskResponseDto updateTask(TaskRequestDto requestDto) {
        Task task = taskJpaRepository.findByIsbn(requestDto.getIsbn())
                .orElseThrow(() -> new TaskNotFoundException("isbn: " + requestDto.getIsbn()));
        task = taskJpaRepository.save(task.update(requestDto));
        return new TaskResponseDto(task);
    }

    @Override
    public TaskResponseDto deleteTask(Long id) {
        Task task = taskJpaRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("id: " + id));
        taskJpaRepository.delete(task);
        return new TaskResponseDto(task);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Override
    public TaskResponseDto getTaskById(Long id) {
        Task task = taskJpaRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("id: " + id));
        return new TaskResponseDto(task);
    }

    @Override
    public TaskResponseDto getTaskByIsbn(String isbn) {
        Task task = taskJpaRepository.findByIsbn(isbn)
                .orElseThrow(() -> new TaskNotFoundException("isbn: " + isbn));
        return new TaskResponseDto(task);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Override
    public List<TaskResponseDto> getAllTasks() {
        List<Task> tasks = taskJpaRepository.findAll();
        if (tasks.isEmpty()) throw new TaskNotFoundException();
        return tasks.stream().map(TaskResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksByStatus(Boolean status) {
        List<Task> tasks = taskJpaRepository.findAllByStatus(status).orElseThrow(TaskNotFoundException::new);
        return tasks.stream().map(TaskResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksByTitleContaining(String title) {
        List<Task> tasks = taskJpaRepository.findAllByTitleContaining(title).orElseThrow(TaskNotFoundException::new);
        return tasks.stream().map(TaskResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksBySummaryContaining(String summary) {
        List<Task> tasks = taskJpaRepository.findAllBySummaryContaining(summary).orElseThrow(TaskNotFoundException::new);
        return tasks.stream().map(TaskResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksByKorPromptContaining(String korPrompt) {
        List<Task> tasks = taskJpaRepository.findAllByKorPromptContaining(korPrompt).orElseThrow(TaskNotFoundException::new);
        return tasks.stream().map(TaskResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getAllTasksByEngPromptContaining(String engPrompt) {
        List<Task> tasks = taskJpaRepository.findAllByEngPromptContaining(engPrompt).orElseThrow(TaskNotFoundException::new);
        return tasks.stream().map(TaskResponseDto::new).collect(Collectors.toList());
    }

}
