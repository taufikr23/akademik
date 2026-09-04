package com.taufik.auth.service;

import com.taufik.auth.model.AccountActivation;
import com.taufik.auth.model.User;
import com.taufik.auth.repository.AccountActivationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AccountActivationRepository activationRepository;
    private final UserService userService;

    @Transactional
    public AccountActivation createActivation(User user, String email) {
        log.info("Creating activation for user: {} with email: {}", user.getUsername(), email);

        // Hapus aktivasi lama yang belum digunakan
        activationRepository.findByUserIdAndIsUsedFalse(user.getId())
                .ifPresent(activation -> {
                    activation.setIsUsed(true);
                    activationRepository.save(activation);
                });

        String activationCode = userService.generateActivationCode();

        AccountActivation activation = new AccountActivation();
        activation.setUser(user);
        activation.setActivationCode(activationCode);
        activation.setEmail(email);
        activation.setIsUsed(false);
        activation.setExpiresAt(LocalDateTime.now().plusHours(24));

        AccountActivation saved = activationRepository.save(activation);
        log.info("Activation created with code: {} for email: {}", activationCode, email);

        return saved;
    }

    @Transactional
    public User activateAccount(String token, String username, String newPassword) {
        log.info("Activating account for user: {} with token", username);

        User user = userService.findByUsername(username);

        if (user.getIsActive()) {
            throw new RuntimeException("Akun sudah diaktifkan");
        }

        AccountActivation activation = activationRepository
                .findByActivationCode(token)
                .orElseThrow(() -> new RuntimeException("Token aktivasi tidak valid"));

        if (activation.getIsUsed()) {
            throw new RuntimeException("Token aktivasi sudah digunakan");
        }

        if (activation.getExpiresAt() != null && activation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token aktivasi sudah kadaluarsa. Silakan minta aktivasi ulang ke admin.");
        }

        if (!activation.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Token aktivasi tidak cocok dengan user");
        }

        // Activate user
        User activatedUser = userService.activateUser(user, newPassword);

        // Mark activation as used
        activation.setIsUsed(true);
        activation.setUsedAt(LocalDateTime.now());
        activationRepository.save(activation);

        log.info("Account activated successfully for user: {}", username);

        return activatedUser;
    }

    @Transactional(readOnly = true)
    public AccountActivation getActivationByUser(User user) {
        return activationRepository.findByUserIdAndIsUsedFalse(user.getId())
                .orElse(null);
    }

    public String getActivationCode(User user) {
        AccountActivation activation = getActivationByUser(user);
        return activation != null ? activation.getActivationCode() : null;
    }

    @Transactional(readOnly = true)
    public boolean isTokenValid(String token) {
        return activationRepository.findByActivationCode(token)
                .filter(a -> !a.getIsUsed())
                .filter(a -> a.getExpiresAt() == null || a.getExpiresAt().isAfter(LocalDateTime.now()))
                .isPresent();
    }
}