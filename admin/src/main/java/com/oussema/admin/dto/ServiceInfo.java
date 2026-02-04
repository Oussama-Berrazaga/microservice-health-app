package com.oussema.admin.dto;

public record ServiceInfo(
                String serviceId,
                String uri,
                int port,
                String status) {
}