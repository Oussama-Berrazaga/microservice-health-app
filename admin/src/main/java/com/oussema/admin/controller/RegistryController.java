package com.oussema.admin.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oussema.admin.dto.ServiceInfo;

@RestController
@RequestMapping("/api/admin")
public class RegistryController {

    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping("/services")
    public List<ServiceInfo> getServices() {
        return discoveryClient.getServices().stream()
                .map(serviceId -> {
                    List<ServiceInstance> instances = discoveryClient.getInstances(serviceId);
                    return new ServiceInfo(
                            serviceId,
                            instances.get(0).getUri().toString(),
                            instances.get(0).getPort(),
                            "UP" // Eureka only shows active instances by default
                    );
                })

                .collect(Collectors.toList());
    }
}
