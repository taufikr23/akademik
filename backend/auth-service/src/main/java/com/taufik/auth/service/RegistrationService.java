package com.taufik.auth.service;

import com.taufik.auth.dto.request.SelfRegistrationRequest;
import com.taufik.auth.model.AccountStatus;
import com.taufik.auth.model.Role;
import com.taufik.auth.model.User;
import com.taufik.auth.repository.RoleRepository;
import com.taufik.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(SelfRegistrationRequest request) {
        log.info("Self-registration for user: {} (role: {})", request.getUsername(), request.getRole());

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("NIS/NIP sudah terdaftar: " + request.getUsername());
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email sudah terdaftar: " + request.getEmail());
        }

        // Get role
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role tidak ditemukan: " + request.getRole()));

        // Only SISWA and GURU can self-register
        if (!request.getRole().equals("SISWA") && !request.getRole().equals("GURU")) {
            throw new RuntimeException("Hanya siswa dan guru yang bisa mendaftar sendiri");
        }

        // Create user with PENDING status + all registration data
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setNisn(request.getNisn());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setDepartmentId(request.getDepartmentId());
        user.setClassId(request.getClassId());
        user.setAccountStatus(AccountStatus.PENDING);
        user.setIsActive(false);

        User saved = userRepository.save(user);
        log.info("User registered with PENDING status: {} (id: {})", saved.getUsername(), saved.getId());

        return saved;
    }

    @Transactional(readOnly = true)
    public List<User> getPendingUsers() {
        return userRepository.findByAccountStatus(AccountStatus.PENDING);
    }

    @Transactional
    public User approveUser(Long userId) {
        log.info("Approving user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        if (user.getAccountStatus() != AccountStatus.PENDING) {
            throw new RuntimeException("User sudah diproses sebelumnya");
        }

        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setIsActive(true);

        User saved = userRepository.save(user);
        log.info("User approved: {} (role: {})", saved.getUsername(), saved.getRole().getName());

        return saved;
    }

    @Transactional
    public User rejectUser(Long userId) {
        log.info("Rejecting user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        if (user.getAccountStatus() != AccountStatus.PENDING) {
            throw new RuntimeException("User sudah diproses sebelumnya");
        }

        user.setAccountStatus(AccountStatus.REJECTED);
        user.setIsActive(false);

        User saved = userRepository.save(user);
        log.info("User rejected: {}", saved.getUsername());

        return saved;
    }
}
