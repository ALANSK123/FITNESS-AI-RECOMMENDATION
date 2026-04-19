package com.fitness.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String authId;
    private String email;
    private String firstName;
    private String lastName;
}
