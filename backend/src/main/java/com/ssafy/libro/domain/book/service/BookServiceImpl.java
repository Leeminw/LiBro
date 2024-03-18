package com.ssafy.libro.domain.book.service;

import com.ssafy.libro.domain.book.dto.BookCreateRequestDto;
import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.dto.BookUpdateRequestDto;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

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

    public void updateBooks(String query, String display, String start, String sort) throws IOException {
        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String encodedDisplay = URLEncoder.encode(display, StandardCharsets.UTF_8);
        String encodedStart = URLEncoder.encode(start, StandardCharsets.UTF_8);
        String encodedSort = URLEncoder.encode(sort, StandardCharsets.UTF_8);
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
        String jsonResponse = response.toString();
        parseAndSaveBooks(jsonResponse);

        conn.disconnect();
    }

    private void parseAndSaveBooks(String jsonResponse) {
        // 여기서 JSON 응답을 파싱하고, 파싱된 데이터를 Book 엔티티로 변환한 다음
        // bookRepository를 사용하여 데이터베이스에 저장합니다.
        // 이 예제에서는 실제 JSON 파싱 과정은 구현하지 않습니다.
        // 실제 구현에서는, 예를 들어, Gson 또는 Jackson 라이브러리를 사용하여 JSON 응답을 파싱할 수 있습니다.
    }
}
