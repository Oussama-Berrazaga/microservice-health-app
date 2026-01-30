package com.oussama.health.repository;

import com.oussama.health.entity.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
}
