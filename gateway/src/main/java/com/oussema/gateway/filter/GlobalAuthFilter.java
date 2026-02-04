package com.oussema.gateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.oussema.gateway.service.JwtService;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class GlobalAuthFilter implements GlobalFilter, Ordered {

    @Autowired
    private JwtService jwtService; // Your utility to validate tokens

    @Override
    public int getOrder() {
        return -1; // Ensure this filter runs before others
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        log.info("Path accessed: {}", path);
        // 1. Skip Auth for the Login/Register endpoints
        if (path.contains("/api/auth/")) {
            return chain.filter(exchange);
        }

        // 2. Header Check
        if (!exchange.getRequest().getHeaders().containsHeader(HttpHeaders.AUTHORIZATION)) {
            log.error("Missing Authorization Header");
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authHeader = authHeader.substring(7);
        }

        try {
            // 3. Validate Token
            jwtService.validateToken(authHeader);

            // 4. Role Check for Sensitive Paths
            if (path.contains("/api/registry")) {
                String role = jwtService.extractRole(authHeader);

                if (!"ROLE_ADMIN".equals(role)) {
                    log.warn("Unauthorized access attempt to Registry API by user with role: {}", role);
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }
            }
        } catch (Exception e) {
            log.error("Token Validation Failed: {}", e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete(); // MUST return here to stop the chain
        }

        // IMPORTANT: Move the request forward if all checks pass
        return chain.filter(exchange);
    }

}
