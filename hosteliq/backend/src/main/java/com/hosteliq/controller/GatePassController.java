package com.hosteliq.controller;

import com.hosteliq.entity.GatePass;
import com.hosteliq.service.GatePassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/gatepasses")
public class GatePassController {
    @Autowired
    private GatePassService gatePassService;

    @GetMapping
    public ResponseEntity<List<GatePass>> getAllGatePasses() {
        return ResponseEntity.ok(gatePassService.getAllGatePasses());
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<List<GatePass>> getGatePassesByStudent(@PathVariable Long userId) {
        return ResponseEntity.ok(gatePassService.getGatePassesByStudent(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GatePass> getGatePassById(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.getGatePassById(id));
    }

    @PostMapping("/scan/{passCode}")
    public ResponseEntity<GatePass> verifyAndScanPass(@PathVariable String passCode) {
        return ResponseEntity.ok(gatePassService.verifyAndScanPass(passCode));
    }
}
