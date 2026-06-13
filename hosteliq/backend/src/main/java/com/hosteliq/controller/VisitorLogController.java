package com.hosteliq.controller;

import com.hosteliq.entity.VisitorLog;
import com.hosteliq.service.VisitorLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/visitors")
public class VisitorLogController {
    @Autowired
    private VisitorLogService visitorLogService;

    @GetMapping
    public ResponseEntity<List<VisitorLog>> getAllVisitorLogs() {
        return ResponseEntity.ok(visitorLogService.getAllVisitorLogs());
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<List<VisitorLog>> getVisitorLogsByStudent(@PathVariable Long userId) {
        return ResponseEntity.ok(visitorLogService.getVisitorLogsByStudent(userId));
    }

    @PostMapping("/check-in/{studentId}")
    public ResponseEntity<VisitorLog> checkInVisitor(
            @PathVariable Long studentId,
            @RequestBody VisitorLog log,
            @RequestParam Long securityUserId) {
        return ResponseEntity.ok(visitorLogService.checkInVisitor(studentId, log, securityUserId));
    }

    @PostMapping("/check-out/{id}")
    public ResponseEntity<VisitorLog> checkOutVisitor(@PathVariable Long id) {
        return ResponseEntity.ok(visitorLogService.checkOutVisitor(id));
    }
}
