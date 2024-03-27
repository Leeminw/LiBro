package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;
import com.ssafy.libro.domain.shorts.dto.TaskRequestDto;
import com.ssafy.libro.domain.shorts.dto.TaskResponseDto;
import com.ssafy.libro.domain.shorts.entity.Task;
import com.ssafy.libro.domain.shorts.exception.TaskNotFoundException;
import com.ssafy.libro.domain.shorts.repository.TaskJpaRepository;
import com.ssafy.libro.domain.shorts.repository.TaskRedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final BookRepository bookRepository;
    private final TaskJpaRepository taskJpaRepository;
    private final TaskRedisRepository taskRedisRepository;
    private final PromptServiceImpl promptService;

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private final SecureRandom secureRandom = new SecureRandom();
    private final int minWaitTime = 100; // Minimum wait time in milliseconds
    private final int maxWaitTime = 500; // Maximum wait time in milliseconds

    // @Scheduled(cron = "0 */1 * * * *", zone = "Asia/Seoul")
    public void updateTasks() throws IOException {
        log.info("Task Update Schedule Processing...");
        List<Book> books = bookRepository.findAllByShortsUrlIsNull().orElseThrow(
                () -> new BookNotFoundException(""));

        int count = 0;
        for (Book book : books) {
            if (taskJpaRepository.existsByIsbn(book.getIsbn()))
                continue;

            PromptResponseDto prompts = promptService.tokenizeText2Prompt(
                    PromptRequestDto.builder()
                            .title(book.getTitle())
                            .content(book.getSummary())
                            .build()
            );

            TaskRequestDto taskRequestDto = TaskRequestDto.builder()
                    .isbn(book.getIsbn())
                    .title(book.getTitle())
                    .status(false)
                    .summary(book.getSummary())
                    .korPrompt(prompts.getKorPrompt())
                    .engPrompt(prompts.getEngPrompt())
                    .build();


            Task task = taskJpaRepository.save(taskRequestDto.toEntity());
            log.info("Task Saved Success: " + task.getTitle());

            int randomWaitTime = secureRandom.nextInt(maxWaitTime - minWaitTime + 1) + minWaitTime;
            try {
                log.debug("Waiting for " + randomWaitTime + " milliseconds...");
                Thread.sleep(randomWaitTime);
            } catch (InterruptedException e) {
                log.error("Thread interrupted while waiting.");
                Thread.currentThread().interrupt(); // Restore interrupted status
            }
            if (count++ > 50) break;
        }
        log.info("Task Update Schedule Complete!!!");
    }
}
