package com.oussema.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class GatewayCorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 1. Allow your React Dev Server
        config.addAllowedOrigin("http://localhost:5173");

        // 2. Allow all standard methods
        config.addAllowedMethod("*");

        // 3. Allow all headers (Crucial for Authorization header!)
        config.addAllowedHeader("*");

        // 4. Allow the browser to send credentials (if needed later)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}