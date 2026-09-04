package com.taufik.grade;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GradeApplication {
    public static void main(String[] args) {
        SpringApplication.run(GradeApplication.class, args);
        System.out.println("========================================");
        System.out.println("Grade Service SIASEK berjalan!");
        System.out.println("========================================");
    }
}
