package com.taufik.auth;

import com.taufik.auth.model.AccountStatus;
import com.taufik.auth.model.Role;
import com.taufik.auth.model.User;
import com.taufik.auth.repository.RoleRepository;
import com.taufik.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class AuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
        System.out.println("========================================");
        System.out.println("🔐 Auth Service SIASEK berjalan!");
        System.out.println("========================================");
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Role ADMIN not found"));

                User admin = new User();
                admin.setUsername("admin");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(adminRole);
                admin.setEmail("admin@siasek.com");
                admin.setIsActive(true);
                admin.setAccountStatus(AccountStatus.ACTIVE);
                userRepository.save(admin);
                System.out.println("✅ Default admin created: admin / admin123");
            } else {
                System.out.println("ℹ️  Admin already exists, skipping creation.");
            }
        };
    }
}
