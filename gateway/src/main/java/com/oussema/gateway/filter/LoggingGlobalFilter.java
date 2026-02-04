package com.oussema.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class LoggingGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Pre-filter logic: Capture start time
        long startTime = System.currentTimeMillis();
        String path = exchange.getRequest().getPath().toString();

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            // Post-filter logic: Execute after the response returns
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;

            log.info("Request Path: {} | Response Time: {}ms | Status Code: {}",
                    path, executionTime, exchange.getResponse().getStatusCode());
        }));
    }

    @Override
    public int getOrder() {
        // Sets the priority. -1 is high priority, ensuring it wraps other filters.
        return -1;
    }

}
