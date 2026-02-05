package com.oussema.admin.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.oussema.admin.dto.ServiceInfo;

@RestController
@RequestMapping("/api/admin")
public class RegistryController {

    private final DiscoveryClient discoveryClient;
    private final RestTemplate restTemplate;

    public RegistryController(DiscoveryClient discoveryClient, RestTemplate restTemplate) {
        this.discoveryClient = discoveryClient;
        this.restTemplate = restTemplate;
    }

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

    @GetMapping("/registry")
    public List<Map<String, Object>> getExtendedRegistry() {
        // 1. Get all service names (identity, health, etc.)
        return discoveryClient.getServices().stream()
                // 2. For each name, get all its running instances
                .flatMap(serviceId -> discoveryClient.getInstances(serviceId).stream())
                .map(instance -> {
                    Map<String, Object> info = new HashMap<>();

                    // Unique ID for React keys (e.g., "health-service:8082")
                    info.put("instanceId", instance.getServiceId() + ":" + instance.getPort());
                    info.put("serviceId", instance.getServiceId());
                    info.put("port", instance.getPort());

                    String healthUrl = instance.getUri().toString() + "/actuator/health";

                    try {
                        Map<String, Object> health = restTemplate.getForObject(healthUrl, Map.class);
                        info.put("status", health.get("status"));
                        info.put("details", health.get("components"));
                    } catch (Exception e) {
                        info.put("status", "DOWN");
                        info.put("details", "Actuator unreachable");
                    }
                    return info;
                })
                .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/shutdown/{serviceId}/{port}")
    public Map<String, String> shutdownInstance(@PathVariable String serviceId, @PathVariable int port) {
        // Find the specific instance by port
        String shutdownUrl = discoveryClient.getInstances(serviceId).stream()
                .filter(inst -> inst.getPort() == port)
                .findFirst()
                .map(inst -> inst.getUri().toString() + "/actuator/shutdown")
                .orElse(null);

        if (shutdownUrl != null) {
            try {
                // 1. Set the headers to application/json
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                // 2. Create an entity with an empty body "{}"
                HttpEntity<String> entity = new HttpEntity<>("{}", headers);

                // 3. Use postForObject with the entity
                return restTemplate.postForObject(shutdownUrl, entity, Map.class);
            } catch (Exception e) {
                return Collections.singletonMap("message", "Shutdown failed: " + e.getMessage());
            }
        }
        return Collections.singletonMap("message", "Instance not found");
    }
}
