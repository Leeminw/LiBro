package com.ssafy.libro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class LibroApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibroApplication.class, args);
    }

}
