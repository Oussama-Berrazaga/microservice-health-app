package com.oussema.identity.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oussema.identity.dto.LoginRequest;
import com.oussema.identity.dto.LoginResponse;
import com.oussema.identity.service.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> getToken(@RequestBody LoginRequest request) {
        // In a real app, you'd check a password here.
        // For now, we are just proving the "Token Factory" works.
        String token = jwtService.generateToken(request.login(), request.password());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
