package com.taufik.auth.repository;

import com.taufik.auth.model.AccountStatus;
import com.taufik.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    List<User> findByAccountStatus(AccountStatus accountStatus);
}
