package com.oussema.gateway.filter;
// package com.oussema.gateway;

// import java.time.Duration;

// import org.springframework.cloud.gateway.filter.GatewayFilterChain;
// import org.springframework.cloud.gateway.filter.GlobalFilter;
// import org.springframework.core.Ordered;
// import org.springframework.stereotype.Component;
// import org.springframework.web.server.ServerWebExchange;

// import lombok.extern.slf4j.Slf4j;
// import reactor.core.publisher.Mono;

// @Slf4j
// @Component
// public class SlowSecurityFilter implements GlobalFilter, Ordered {

// @Override
// public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain
// chain) {
// log.info("Step 1: Request received. Starting 'Security Check'...");

// return Mono.delay(Duration.ofSeconds(2)) // Simulate an async delay
// .flatMap(delay -> {
// // This block runs ONLY after the 2 seconds are up
// log.info("Step 2: Security Check complete after 2 seconds.");

// // We 'flatten' the next async task (the rest of the filter chain)
// return chain.filter(exchange);
// });
// }

// @Override
// public int getOrder() {
// return -2; // Run this BEFORE the logging filter
// }
// }