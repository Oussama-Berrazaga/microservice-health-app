package com.oussama.health.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class StatusController {

    @GetMapping("")
    public ResponseEntity<String> check(){
        return new ResponseEntity<>("OK",HttpStatus.OK);
    }
    @GetMapping("api/status")
    public ResponseEntity<String> status() {
        return new ResponseEntity<>("System is online", HttpStatus.OK);
    }

}
