package com.taufik.auth.repository;

import com.taufik.auth.model.AccountActivation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface AccountActivationRepository extends JpaRepository<AccountActivation, Long> {
    Optional<AccountActivation> findByActivationCodeAndIsUsedFalse(String activationCode);
    Optional<AccountActivation> findByUserIdAndIsUsedFalse(Long userId);
}