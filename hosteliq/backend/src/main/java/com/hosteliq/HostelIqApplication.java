package com.hosteliq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class HostelIqApplication {
    public static void main(String[] args) {
        SpringApplication.run(HostelIqApplication.class, args);
    }
}
