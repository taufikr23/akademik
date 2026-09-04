package com.taufik.akademik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AcademicApplication {
    public static void main(String[] args) {
        SpringApplication.run(AcademicApplication.class, args);
        System.out.println("========================================");
        System.out.println("Academic Service SIASEK berjalan!");
        System.out.println("========================================");
    }
}