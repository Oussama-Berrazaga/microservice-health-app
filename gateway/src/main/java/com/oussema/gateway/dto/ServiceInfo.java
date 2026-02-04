package com.oussema.gateway.dto;

public record ServiceInfo(
        String serviceId,
        String uri,
        int port,
        String status) {
}