package com.taufik.auth.service;

import com.taufik.auth.model.Role;
import com.taufik.auth.model.User;
import com.taufik.auth.repository.RoleRepository;
import com.taufik.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(String username, String password, String roleName) {
        log.info("Creating user: {}", username);

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists: " + username);
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);
        user.setIsActive(false);

        User saved = userRepository.save(user);
        log.info("User created successfully with id: {}", saved.getId());

        return saved;
    }

    @Transactional
    public User createInactiveUser(String username, String email, String roleName) {
        log.info("Creating inactive user: {} with email: {}", username, email);

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username (NIS/NIP) sudah terdaftar: " + username);
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email sudah terdaftar: " + email);
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role tidak ditemukan: " + roleName));

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode("TEMPORARY_PASSWORD_NOT_TO_BE_USED"));
        user.setEmail(email);
        user.setRole(role);
        user.setIsActive(false);

        User saved = userRepository.save(user);
        log.info("Inactive user created with id: {}", saved.getId());

        return saved;
    }

    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    @Transactional
    public User activateUser(User user, String newPassword) {
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setIsActive(true);
        return userRepository.save(user);
    }

    public String generateActivationCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    @Transactional
    public User validateUser(String username, String password) {
        User user = findByUsername(username);

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Password salah");
        }

        return user;
    }
}
