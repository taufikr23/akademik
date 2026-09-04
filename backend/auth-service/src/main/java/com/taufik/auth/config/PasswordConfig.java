package com.taufik.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Bean PasswordEncoder dipisah dari SecurityConfig agar tidak terjadi
 * circular dependency: UserService membutuhkan PasswordEncoder, sedangkan
 * SecurityConfig membutuhkan UserService.
 */
@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
