package com.oussama.health.service;

import com.oussama.health.entity.DailyLog;
import com.oussama.health.repository.DailyLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;


    public DailyLog create(DailyLog dailyLog){
        return dailyLogRepository.save(dailyLog);
    }
}
