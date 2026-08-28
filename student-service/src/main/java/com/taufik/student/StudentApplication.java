package com.taufik.student;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class StudentApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentApplication.class, args);
        System.out.println("========================================");
        System.out.println("👨‍🎓 Student Service SIASEK berjalan!");
        System.out.println("========================================");
    }
}