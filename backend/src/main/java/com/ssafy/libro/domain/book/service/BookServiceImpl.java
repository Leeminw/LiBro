package com.ssafy.libro.domain.book.service;

import com.nimbusds.jose.shaded.gson.Gson;
import com.ssafy.libro.domain.book.dto.*;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;

    @Override
    public BookDetailResponseDto createBook(BookCreateRequestDto requestDto) {
        Book book = bookRepository.save(requestDto.toEntity());
        return new BookDetailResponseDto(book);
    }

    @Override
    public BookDetailResponseDto updateBook(BookUpdateRequestDto requestDto) {
        Book book = bookRepository.findById(requestDto.getId()).orElseThrow(
                () -> new BookNotFoundException(requestDto.getId()));
        book = bookRepository.save(book.update(requestDto));
        return new BookDetailResponseDto(book);
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public BookDetailResponseDto getBook(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new BookNotFoundException(id));
        return new BookDetailResponseDto(book);
    }

    @Override
    public List<BookDetailResponseDto> getBooks() {
        List<Book> books = bookRepository.findAll();
        return books.stream().map(BookDetailResponseDto::new).toList();
    }

    @Override
    public List<BookDetailResponseDto> getBooksByTitle(String title, Pageable pageable) {
        log.debug("service page : {} , size : {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<Book> bookList = bookRepository.findBookByTitleContaining(title, pageable);
        List<BookDetailResponseDto> responseDto = new ArrayList<>();
        for(Book book : bookList.getContent()){
            log.debug("requested data : {}", book);

            responseDto.add(new BookDetailResponseDto(book));
        }

        return responseDto;
    }

    @Override
    public List<BookDetailResponseDto> getBooksByAuthor(String author, Pageable pageable) {
        Page<Book> bookList = bookRepository.findBookByAuthorContaining(author,pageable);
        List<BookDetailResponseDto> responseDto = new ArrayList<>();
        for(Book book : bookList){
            responseDto.add(new BookDetailResponseDto(book));
        }
        return responseDto;
    }

    @Override
    public List<BookDetailResponseDto> getBooksByIsbn(String isbn) {
        List<Book> bookList = bookRepository.findBookByIsbn(isbn)
                .orElseThrow(() -> new BookNotFoundException(isbn));
        List<BookDetailResponseDto> responseDto = new ArrayList<>();
        for(Book book : bookList){
            responseDto.add(new BookDetailResponseDto(book));
        }
        return responseDto;
    }

    @Override
    public void updateBooksByApi(String query) throws IOException {
        String display = "100", sort = "sim";
        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String encodedDisplay = URLEncoder.encode(display, StandardCharsets.UTF_8);
        String encodedSort = URLEncoder.encode(sort, StandardCharsets.UTF_8);
        for (int i = 1; i <= 100; i++) {
            String encodedStart = URLEncoder.encode(String.valueOf(i), StandardCharsets.UTF_8);
            String urlString = String.format("https://openapi.naver.com/v1/search/book.json?query=%s&display=%s&start=%s&sort=%s",
                    encodedQuery, encodedDisplay, encodedStart, encodedSort);

            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("X-Naver-Client-Id", "id-key");
            conn.setRequestProperty("X-Naver-Client-Secret", "secret-key");

            if (conn.getResponseCode() != 200) {
                throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
            }

            // 응답 받기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }
            br.close();
            conn.disconnect();

            // 응답 파싱 및 데이터베이스 저장 로직 추가
            Gson gson = new Gson();
            ApiResponseList responseList = gson.fromJson(response.toString(), ApiResponseList.class);
            for (ApiResponseItem item : responseList.getItems()) {
                BookCreateRequestDto requestDto = BookCreateRequestDto.builder()
                        .isbn(item.getIsbn())
                        .title(item.getTitle())
                        .summary(item.getDescription())

                        .price(Integer.parseInt(item.getDiscount()))

                        .author(item.getAuthor())
                        .thumbnail(item.getImage())
                        .publisher(item.getPublisher())
                        .pubDate(convertStringToLocalDateTime(item.getPubdate()))
                        .build();

                bookRepository.save(requestDto.toEntity());
            }
        }
    }

    private LocalDateTime convertStringToLocalDateTime(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate date = LocalDate.parse(dateString, formatter);
        return date.atStartOfDay();
    }

}
