package com.hosteliq.controller;

import com.hosteliq.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {
    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/live")
    public ResponseEntity<Map<String, Object>> getLiveMetrics() {
        return ResponseEntity.ok(analyticsService.getLiveMetrics());
    }
}
