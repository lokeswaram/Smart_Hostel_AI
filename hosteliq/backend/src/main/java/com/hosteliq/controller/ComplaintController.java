package com.hosteliq.controller;

import com.hosteliq.entity.Complaint;
import com.hosteliq.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {
    @Autowired
    private ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<List<Complaint>> getComplaintsByStudent(@PathVariable Long userId) {
        return ResponseEntity.ok(complaintService.getComplaintsByStudent(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PostMapping("/student/{userId}")
    public ResponseEntity<Complaint> createComplaint(@PathVariable Long userId, @RequestBody Complaint complaint) {
        return ResponseEntity.ok(complaintService.createComplaint(userId, complaint));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) Long wardenUserId) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status, wardenUserId));
    }
}
