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
    public AccountActivation createActivation(User user) {
        log.info("Creating activation for user: {}", user.getUsername());

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
        activation.setIsUsed(false);

        AccountActivation saved = activationRepository.save(activation);
        log.info("Activation created with code: {}", activationCode);

        return saved;
    }

    @Transactional
    public User activateAccount(String username, String activationCode, String newPassword) {
        log.info("Activating account for user: {}", username);

        User user = userService.findByUsername(username);

        if (user.getIsActive()) {
            throw new RuntimeException("Account already activated");
        }

        AccountActivation activation = activationRepository
                .findByActivationCodeAndIsUsedFalse(activationCode)
                .orElseThrow(() -> new RuntimeException("Invalid or already used activation code"));

        if (!activation.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Activation code does not match user");
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
}