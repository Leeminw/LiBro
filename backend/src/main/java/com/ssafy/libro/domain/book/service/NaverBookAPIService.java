package com.ssafy.libro.domain.book.service;

import java.io.IOException;

public interface NaverBookAPIService {
    void updateBooksByNaverAPI(String query) throws IOException;
}
