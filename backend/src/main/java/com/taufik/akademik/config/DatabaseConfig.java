package com.taufik.akademik.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.taufik.akademik.repository")
public class DatabaseConfig {
    // Konfigurasi database tambahan jika diperlukan
}