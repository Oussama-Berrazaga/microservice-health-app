// package com.oussema.gateway.filter;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.cloud.gateway.filter.GatewayFilter;
// import
// org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
// import org.springframework.stereotype.Component;

// import com.oussema.gateway.service.JwtService;

// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import lombok.extern.slf4j.Slf4j;

// @Component
// @Slf4j
// public class AuthenticationFilter extends
// AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

// @Autowired
// private JwtService jwtService; // Your utility to validate tokens

// public AuthenticationFilter() {
// super(Config.class);
// }

// public static class Config {
// }

// @Override
// public GatewayFilter apply(Config config) {
// return (exchange, chain) -> {
// // 1. Check for Header
// if
// (!exchange.getRequest().getHeaders().containsHeader(HttpHeaders.AUTHORIZATION))
// {
// log.error("Missing Authorization Header");
// exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
// return exchange.getResponse().setComplete();
// }

// String authHeader =
// exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
// if (authHeader != null && authHeader.startsWith("Bearer ")) {
// authHeader = authHeader.substring(7);
// }

// try {
// // 2. Validate Token Signature/Expiration
// jwtService.validateToken(authHeader);

// // 3. Path-Based Role Check (The "Architect" Guard)
// String path = exchange.getRequest().getURI().getPath();
// if (path.contains("/api/registry")) {
// // We extract the roles from the token claims
// String role = jwtService.extractRole(authHeader); // You'll need to add this
// method to your
// // JwtService

// if (!"ROLE_ADMIN".equals(role)) {
// log.warn("Unauthorized access attempt to Registry API by user with role: {}",
// role);
// exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN); // 403 Forbidden
// return exchange.getResponse().setComplete();
// }
// }
// } catch (Exception e) {
// log.error("Token Validation Failed: {}", e.getMessage());
// exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
// return exchange.getResponse().setComplete();
// }

// return chain.filter(exchange);
// };
// }
// }