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

@SpringBootApplication(scanBasePackages = "com.taufik")
@org.springframework.boot.autoconfigure.domain.EntityScan("com.taufik")
@org.springframework.data.jpa.repository.config.EnableJpaRepositories("com.taufik")
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
        RestTemplate client = new RestTemplate();
        client.getInterceptors().add((request, body, next) -> {
            if ("127.0.0.1".equals(request.getURI().getHost())
                    && org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()
                    instanceof org.springframework.web.context.request.ServletRequestAttributes current) {
                String token = current.getRequest().getHeader("Authorization");
                if (token != null && current.getRequest().getLocalPort() == request.getURI().getPort()) {
                    request.getHeaders().set("Authorization", token);
                }
            }
            return next.execute(request, body);
        });
        return client;
    }

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Role ADMIN not found"));

                User admin = new User();
                admin.setUsername("admin");
                admin.setPasswordHash(passwordEncoder.encode(java.util.Objects.requireNonNull(System.getenv("ADMIN_INITIAL_PASSWORD"))));
                admin.setRole(adminRole);
                admin.setEmail("admin@siasek.com");
                admin.setIsActive(true);
                admin.setAccountStatus(AccountStatus.ACTIVE);
                userRepository.save(admin);
                System.out.println("Admin account initialized.");
            } else {
                System.out.println("ℹ️  Admin already exists, skipping creation.");
            }
        };
    }
}
