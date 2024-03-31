package com.ssafy.libro.domain.book.service;

import com.nimbusds.jose.shaded.gson.Gson;
import com.ssafy.libro.domain.book.dto.BookCreateRequestDto;
import com.ssafy.libro.domain.book.dto.NaverAPIResponseList;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NaverBookAPIServiceImpl implements NaverBookAPIService {

    private final BookRepository bookRepository;

    @Value("${naver.developers.openapi.client-id:client-id}")
    private String clientId;

    @Value("${naver.developers.openapi.client-secret:client-secret}")
    private String clientSecret;

    private static final int MAX_RESULTS = 1000;
    private static final int RESULTS_PER_PAGE = 100;
    private static final String BASE_URL = "https://openapi.naver.com/v1/search/book.json";

    @Override
    public void updateBooksByNaverAPI(String query) throws IOException {
        for (int start = 1; start <= MAX_RESULTS; start += RESULTS_PER_PAGE) {
            String requestURL = createRequestURL(query, start);
            String response = requestURL(requestURL);

            Gson gson = new Gson();
            NaverAPIResponseList responseList = gson.fromJson(response, NaverAPIResponseList.class);
            List<Book> booksToSave = convertToBooks(responseList);

            bookRepository.saveAll(booksToSave);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private String createRequestURL(String query, int start) {
        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String queryString = String.format("?query=%s&display=%d&start=%d&sort=sim",
                encodedQuery, RESULTS_PER_PAGE, start);
        return BASE_URL + queryString;
    }

    private String requestURL(String requestURL) throws IOException {
        HttpURLConnection conn = createHttpURLConnection(new URL(requestURL));
        StringBuilder response = new StringBuilder();

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            br.lines().forEach(response::append);
        } finally {
            conn.disconnect();
        }

        return response.toString();
    }

    private HttpURLConnection createHttpURLConnection(URL url) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");
        conn.setRequestProperty("X-Naver-Client-Id", clientId);
        conn.setRequestProperty("X-Naver-Client-Secret", clientSecret);
        if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
            conn.disconnect();
            throw new RuntimeException("HTTP Request Failed with Status Code: " + conn.getResponseCode());
        }
        return conn;
    }

    private List<Book> convertToBooks(NaverAPIResponseList responseList) {
        return responseList.getItems().stream()
                .map(item -> BookCreateRequestDto.builder()
                        .isbn(item.getIsbn())
                        .title(item.getTitle())
                        .author(item.getAuthor())
                        .thumbnail(item.getImage())
                        .publisher(item.getPublisher())
                        .summary(item.getDescription())
                        .price(Integer.parseInt(item.getDiscount()))
                        .pubDate(convertStringToLocalDateTime(item.getPubdate()))
                        .build().toEntity())
                .toList();
    }

    private LocalDateTime convertStringToLocalDateTime(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate date = LocalDate.parse(dateString, formatter);
        return date.atStartOfDay();
    }
}
