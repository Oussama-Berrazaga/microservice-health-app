package com.oussama.health.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class DailyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime timestamp = LocalDateTime.now();
    private String status; // e.g., "Focused", "Struggling", "Recovered"
    private String activity; // e.g., "Spring Boot Sprint"
}
