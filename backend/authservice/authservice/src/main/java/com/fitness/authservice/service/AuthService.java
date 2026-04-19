package com.fitness.authservice.service;

import com.fitness.authservice.dto.AuthResponse;
import com.fitness.authservice.dto.LoginRequest;
import com.fitness.authservice.dto.RegisterRequest;
import com.fitness.authservice.model.AuthUser;
import com.fitness.authservice.repository.AuthUserRepository;
import com.fitness.authservice.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthUserRepository authUserRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        if (authUserRepository.existsByEmail(request.getEmail())) {
            // User already exists — return their token (same as Keycloak behavior)
            AuthUser existing = authUserRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String token = jwtTokenProvider.generateToken(
                    existing.getAuthId(), existing.getEmail(),
                    existing.getFirstName(), existing.getLastName()
            );
            return new AuthResponse(token, existing.getAuthId(), existing.getEmail(),
                    existing.getFirstName(), existing.getLastName());
        }

        AuthUser user = new AuthUser();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        // If migrating from Keycloak, reuse the old keycloakId as authId to preserve user data
        if (request.getExistingAuthId() != null && !request.getExistingAuthId().isBlank()) {
            user.setAuthId(request.getExistingAuthId());
        } else {
            user.setAuthId(UUID.randomUUID().toString());
        }

        AuthUser saved = authUserRepository.save(user);
        log.info("Registered new user: {}", saved.getEmail());

        String token = jwtTokenProvider.generateToken(
                saved.getAuthId(), saved.getEmail(),
                saved.getFirstName(), saved.getLastName()
        );
        return new AuthResponse(token, saved.getAuthId(), saved.getEmail(),
                saved.getFirstName(), saved.getLastName());
    }

    public AuthResponse login(LoginRequest request) {
        AuthUser user = authUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(
                user.getAuthId(), user.getEmail(),
                user.getFirstName(), user.getLastName()
        );

        log.info("User logged in: {}", user.getEmail());
        return new AuthResponse(token, user.getAuthId(), user.getEmail(),
                user.getFirstName(), user.getLastName());
    }
}
