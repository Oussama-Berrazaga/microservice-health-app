package com.oussama.health.controller;

import com.oussama.health.entity.DailyLog;
import com.oussama.health.service.DailyLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/daily-logs")
public class DailyLogController {

    private final DailyLogService dailyLogService;

    @PostMapping()
    public ResponseEntity<String> createLog(@RequestBody DailyLog newDailyLog) {
        DailyLog dailyLog = dailyLogService.create(newDailyLog);
        return new ResponseEntity<>("Daily log created" + dailyLog, HttpStatus.CREATED);
    }
}
